# -*- coding: utf-8 -*-
""" Content in the publication. """

# Python standard library
import re
import os
import datetime
from io import BytesIO
import logging
import collections
import subprocess
import unicodedata
import uuid
import pathlib

# Django core
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.db.models.signals import pre_delete, pre_save
from django.dispatch.dispatcher import receiver
from django.core.files.base import ContentFile

# Installed apps
import PyPDF2
import boto
from sorl import thumbnail
from wand.image import Image as WandImage
from wand.color import Color
from wand.drawing import Drawing
import os.path

from utils.model_mixins import Edit_url_mixin
logger = logging.getLogger('universitas')


def upload_pdf_to(instance, filename):
    dirname = uuid.uuid1().hex
    return os.path.join('pdf', dirname, filename)


def extract_pdf_text(pdf_data, first_page, last_page=None):
    """ Extracts text from a page in the pdf """
    if last_page is None:
        last_page = first_page
    # pdftotext stdin and stdout
    args = ['pdftotext', '-f', first_page, '-l', last_page, '-', '-']
    args = [str(a) for a in args]
    text = subprocess.run(
        args, check=True, stdout=subprocess.PIPE, input=pdf_data,
    ).stdout.decode()
    text = unicodedata.normalize('NFKD', text).strip()
    text = re.sub(r'\s*\n[\r\n \t]*', '\n', text)
    return text


def pdf_not_found(pdf_name):
    """Creates an error frontpage"""
    img = WandImage(width=300, height=500,)
    msg = 'ERROR:\n{}\nnot found on disk'.format(pdf_name)
    with Drawing() as draw:
        draw.text_alignment = 'center'
        draw.text(img.width // 2, img.height // 3, msg)
        draw(img)
    return img

IssueTuple = collections.namedtuple('IssueTuple', ['number', 'date'])


def current_issue():
    """Return an IssueTuple for the current issue."""
    today = timezone.now().astimezone().date()
    try:
        latest_issue = Issue.objects.latest_issue()
    except Issue.DoesNotExist:
        current_issue = Issue()
    else:
        if latest_issue.publication_date == today:
            current_issue = latest_issue
        else:
            current_issue = Issue.objects.next_issue()

    return current_issue.issue_tuple()


def today():
    return timezone.now().astimezone().date()


class IssueQueryset(models.QuerySet):

    def published(self):
        query = self.filter(publication_date__lte=timezone.now())
        return query

    def unpublished(self):
        query = self.filter(publication_date__gt=timezone.now())
        return query

    def next_issue(self):
        next_issue = self.unpublished().last()
        if not next_issue:
            next_issue = self.order_by('publication_date').last()
        return next_issue

    def latest_issue(self):
        latest = self.published().first()
        if not latest:
            raise Issue.DoesNotExist('No published issues in database')
        return latest


class Issue(models.Model, Edit_url_mixin):

    """ Past or future print issue """

    objects = IssueQueryset.as_manager()

    REGULAR = 1
    MAGAZINE = 2
    SPECIAL = 3

    ISSUE_TYPES = [
        (REGULAR, _('Regular')),
        (MAGAZINE, _('Magazine')),
        (SPECIAL, _('Welcome special')),
    ]

    publication_date = models.DateField(
        default=today,
        blank=True,
        null=True)
    issue_name = models.CharField(
        max_length=100,
        editable=False,
        blank=True)
    issue_type = models.PositiveSmallIntegerField(
        choices=ISSUE_TYPES,
        default=REGULAR)

    class Meta:
        ordering = ['-publication_date']

    def __str__(self):
        if self.issue_type != Issue.REGULAR:
            description = ' ({})'.format(
                self.get_issue_type_display())
        else:
            description = ''

        return '{issue_name}{issue_type} {date}'.format(
            issue_name=self.issue_name,
            issue_type=description,
            date=self.formatted_date,
        )

    def natural_key(self):
        return '{}'.format(self.publication_date)

    def save(self, *args, **kwargs):
        self.issue_name = '{issue.number}/{issue.date.year}'.format(
            issue=self.issue_tuple())
        return super(Issue, self).save(*args, **kwargs)

    def issue_tuple(self):
        number = self.__class__.objects.filter(
            publication_date__year=self.publication_date.year,
            publication_date__lt=self.publication_date
        ).count() + 1
        return IssueTuple(
            date=self.publication_date,
            number=number)

    @property
    def advert_deadline(self):
        two_days = datetime.timedelta(days=2)
        return self.publication_date - two_days

    @property
    def formatted_date(self):
        return _('{date:%d. %b}').format(date=self.publication_date)


class PrintIssue(models.Model, Edit_url_mixin):

    """ PDF file of a printed newspaper. """

    class Meta:
        # ordering = ['-publication_date']
        verbose_name = _('Pdf issue')
        verbose_name_plural = _('Pdf issues')

    issue = models.ForeignKey(
        Issue, related_name='pdfs'
    )

    pages = models.IntegerField(
        help_text='Number of pages',
        editable=False,)

    pdf = models.FileField(
        help_text=_('Pdf file for this issue.'),
        upload_to=upload_pdf_to,
    )

    cover_page = thumbnail.ImageField(
        help_text=_('An image file of the front page'),
        upload_to='pdf/covers/',
        blank=True,
        null=True,
    )

    text = models.TextField(
        help_text=_('Extracted from file.'),
        editable=False,
    )

    def __str__(self):
        if self.pdf:
            return self.pdf.url
        else:
            return super().__str__()

    def save(self, *args, **kwargs):
        if self.pk:
            old_self = type(self).objects.get(pk=self.pk)
        else:
            old_self = PrintIssue()
        if self.pdf and old_self.pdf != self.pdf:
            reader = PyPDF2.PdfFileReader(self.pdf, strict=False)
            self.pages = reader.numPages
            self.text = reader.getPage(0).extractText()[:200]
            self.cover_page.delete()
        if not self.pdf and self.cover_page:
            self.cover_page.delete()
        if self.pdf and not self.issue_id:
            publication_date = self.get_publication_date()
            self.issue, created = Issue.objects.get_or_create(
                publication_date=publication_date,
            )

        super().save(*args, **kwargs)

    def create_thumbnail(self):
        """ Create a jpg version of the pdf frontpage """
        def pdf_frontpage_to_image():
            reader = PyPDF2.PdfFileReader(self.pdf.file, strict=False)
            writer = PyPDF2.PdfFileWriter()
            first_page = reader.getPage(0)
            writer.addPage(first_page)
            outputStream = BytesIO()
            writer.write(outputStream)
            outputStream.seek(0)
            img = WandImage(
                blob=outputStream,
                format='pdf',
                resolution=60,
            )
            background = WandImage(
                width=img.width,
                height=img.height,
                background=Color('white'))
            background.format = 'jpeg'
            background.composite(img, 0, 0)
            return background

        def pdf_not_found():
            """Creates an error frontpage"""
            img = WandImage(width=400, height=600,)
            msg = 'ERROR:\n{}\nnot found on disk'.format(self.pdf.name)
            with Drawing() as draw:
                draw.text_alignment = 'center'
                draw.text(img.width // 2, img.height // 3, msg)
                draw(img)
            background = WandImage(
                width=img.width,
                height=img.height,
                background=Color('white'))
            background.format = 'jpeg'
            background.composite(img, 0, 0)
            return background

        filename = pathlib.Path(self.pdf.name).with_suffix('.jpg').name

        try:
            cover = pdf_frontpage_to_image()
        except Exception as err:
            cover = pdf_not_found()
            filename = filename.replace('.jpg', '_not_found.jpg')
            logger.error('Error: %s pdf not found: %s ' % (err, self.pdf))

        blob = BytesIO()
        cover.save(blob)
        imagefile = ContentFile(blob.getvalue())
        self.cover_page.save(filename, imagefile, save=True)

    def get_thumbnail(self):
        """ Get or create a jpg version of the pdf frontpage """
        pdf = self.pdf
        if not pdf:
            return None
        if self.cover_page:
            return self.cover_page

        self.create_thumbnail()
        return self.cover_page

    def get_publication_date(self):
        dateline_regex = (
            r'^\d(?P<day>\w+) (?P<date>\d{1,2})\.'
            r' (?P<month>\w+) (?P<year>\d{4})')
        MONTHS = [
            'januar', 'februar', 'mars', 'april', 'mai', 'juni',
            'juli', 'august', 'september', 'oktober', 'november', 'desember',
        ]
        pdf_data = self.pdf.file.read()
        try:
            page_2_text = extract_pdf_text(pdf_data, 2)
        except subprocess.CalledProcessError:
            page_2_text = ''

        dateline = re.match(dateline_regex, page_2_text)
        if dateline:
            day = int(dateline.group('date'))
            year = int(dateline.group('year'))
            month = MONTHS.index(dateline.group('month')) + 1
            created = datetime.date(day=day, month=month, year=year)
        else:
            # Finds creation date.
            try:
                created = datetime.date.fromtimestamp(
                    os.path.getmtime(self.pdf.path))
            except NotImplementedError:
                key = self.pdf.file.key
                created = boto.utils.parse_ts(key.last_modified)
            # Sets creation date as a Wednesday, if needed.
            created = created + datetime.timedelta(
                days=3 - created.isoweekday())
        return created

    def get_absolute_url(self):
        return self.pdf.url


@receiver(pre_delete, sender=PrintIssue)
def delete_pdf_and_cover_page(sender, instance, **kwargs):
    thumbnail.delete(instance.cover_page, delete_file=True)
    instance.pdf.delete(False)


@receiver(pre_save, sender=PrintIssue)
def remove_thumbnail(sender, instance, **kwargs):
    if instance.pk is None:
        return
    try:
        thumbnail.delete(instance.cover_page, delete_file=False)
    except thumbnail.helpers.ThumbnailError as err:
        logger.debug('instance: %s error: %s' % (instance, err))
