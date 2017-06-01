""" Content in the publication. """

# pylint: disable=no-member
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
from pathlib import Path

# Django core
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.conf import settings
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
IssueTuple = collections.namedtuple('IssueTuple', ['number', 'date'])


class BrokenImage:
    """If thumbnail fails"""
    url = settings.STATIC_URL + 'admin/img/icon-no.svg'

    def read(self):
        return b''


def upload_pdf_to(instance, filename):
    dirname = uuid.uuid1().hex
    return os.path.join('pdf', dirname, filename)


def pdf_number_of_pages(pdf):
    try:
        pdf.open()
        reader = PyPDF2.PdfFileReader(pdf, strict=False)
        return reader.numPages
    finally:
        pdf.close()


def pdf_to_text(pdf, first_page=1, last_page=None):
    """Extracts text from a page in the pdf"""
    if last_page is None:
        last_page = first_page
    args = ['pdftotext', '-raw', '-f', first_page, '-l', last_page, '-', '-']
    args = [str(a) for a in args]
    try:
        pdf.open()
        pdf_data = pdf.read()
    finally:
        pdf.close()
    text = subprocess.run(
        args, check=True, stdout=subprocess.PIPE, input=pdf_data,
    ).stdout.decode()
    text = unicodedata.normalize('NFKD', text).strip()
    text = re.sub(r'\s*\n[\r\n \t]*', '\n', text)
    return text


def pdf_to_image(pdf, page=1, resolution=60, file_format='jpeg'):
    """Creates a image file from pdf file"""
    try:
        pdf.open()
        reader = PyPDF2.PdfFileReader(pdf, strict=False)
        page_content = reader.getPage(page - 1)
    finally:
        pdf.close()
    writer = PyPDF2.PdfFileWriter()
    writer.addPage(page_content)
    outputStream = BytesIO()
    writer.write(outputStream)
    outputStream.seek(0)
    # put content of page in a new image
    foreground = WandImage(
        blob=outputStream,
        format='pdf',
        resolution=resolution,
    )
    # white background
    background = WandImage(
        width=foreground.width,
        height=foreground.height,
        background=Color('white')
    )
    background.format = file_format
    background.composite(foreground, 0, 0)
    return background


def error_image(msg, width, height):
    """Creates an error frontpage"""
    img = WandImage(width=width, height=height)
    with Drawing() as draw:
        draw.text_alignment = 'center'
        draw.text(img.width // 2, img.height // 3, msg)
        draw(img)
    background = WandImage(
        width=img.width,
        height=img.height,
        background=Color('white'),
    )
    background.format = 'jpeg'
    background.composite(img, 0, 0)
    return background


def current_issue():
    """Return the current or upcoming issue"""
    try:
        latest_issue = Issue.objects.latest_issue()
    except Issue.DoesNotExist:
        return Issue(publication_date=today())
    else:
        if latest_issue.publication_date == today():
            return latest_issue
        else:
            return Issue.objects.next_issue()


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
        if not self.publication_date:
            self.publication_date = today()
        self.issue_name = f'{self.number}/{self.year}'
        return super(Issue, self).save(*args, **kwargs)

    @property
    def year(self):
        return self.publication_date.year

    @property
    def number(self):
        """Issue number for the giber year"""
        return self.__class__.objects.filter(
            publication_date__year=self.year,
            publication_date__lt=self.publication_date,
        ).count() + 1

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
            self.pages = pdf_number_of_pages(self.pdf)
            self.text = self.get_page_text_content(1, 10)
            self.cover_page.delete()
        if not self.pdf and self.cover_page:
            self.cover_page.delete()
        if self.pdf and not self.issue_id:
            publication_date = self.get_publication_date()
            self.issue, created = Issue.objects.get_or_create(
                publication_date=publication_date,
            )

        super().save(*args, **kwargs)

    def get_cover_page(self):
        """ Get or create a jpg version of the pdf frontpage """
        if self.pdf and not self.cover_page:
            filename = Path(self.pdf.name).with_suffix('.jpg').name
            try:
                cover_image = pdf_to_image(self.pdf.file, 1, 60)
            except Exception as e:
                raise e
                logger.exception('Failed to create cover')
                msg = 'ERROR:\n{}\nnot found on disk'.format(self.pdf.name)
                cover_image = error_image(msg, 400, 600)
                filename = filename.replace('.jpg', '_not_found.jpg')

            blob = BytesIO()
            cover_image.save(blob)
            self.cover_page.save(
                filename,
                ContentFile(blob.getvalue()),
                save=True
            )
        return self.cover_page

    def thumbnail(self, size='x150', **options):
        """Create thumb of frontpage"""
        try:
            image = self.get_cover_page()
            return thumbnail.get_thumbnail(image, size, **options)
        except Exception:
            logger.exception('Cannot create thumbnail')
            return BrokenImage()

    def get_page_text_content(self, first_page=1, last_page=None):
        """Extract the textual page content of a page in the pdf"""
        if last_page is None:
            last_page = first_page
        if self.pages:
            last_page = min(self.pages, last_page)
        return pdf_to_text(self.pdf, first_page, last_page)

    def get_publication_date(self):
        dateline_regex = (
            r'^\d(?P<day>\w+) (?P<date>\d{1,2})\.'
            r' (?P<month>\w+) (?P<year>\d{4})')
        MONTHS = [
            'januar', 'februar', 'mars', 'april', 'mai', 'juni',
            'juli', 'august', 'september', 'oktober', 'november', 'desember',
        ]
        page_2_text = self.get_page_text_content(2)
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

    def download_from_aws(self, dest=Path('/var/media/')):
        path = dest / self.pdf.name
        data = self.pdf.file.read()
        path.parent.mkdir(0o775, True, True)
        path.write_bytes(data)


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
