# -*- coding: utf-8 -*-
""" Content in the publication. """

# Python standard library
# import subprocess
import re
import datetime

# Django core
from django.utils.translation import ugettext_lazy as _
from django.db import models
# from django.utils.text import slugify

# Installed apps
from PyPDF2 import PdfFileReader
from sorl.thumbnail import ImageField
from wand.image import Image as WandImage
from wand.color import Color
import os.path
# Project apps


def next_issue():
    name = 33
    year = 2014
    return (year, name)
    # TODO: issues.models.next_issue() er fake. Må finne neste utgave fra
    # databasen i stedet.


class PrintIssue(models.Model):

    """ An printed issue of the publication. """

    issue_name = models.CharField(max_length=50)
    publication_date = models.DateField(blank=True, null=True)
    pages = models.IntegerField(
        help_text='Number of pages',
        editable=False,)
    pdf = models.FileField(
        help_text=_('Pdf file for this issue.'),
        upload_to='pdf/',
        blank=True, null=True,
    )

    cover_page = ImageField(
        help_text=_('An image file of the front page'),
        upload_to='pdf/covers/',
        blank=True,
        null=True,
    )

    text = models.TextField(
        help_text=_('Extracted from file.'),
        editable=False,
    )

    class Meta:
        ordering = ['-publication_date']
        verbose_name = _('Print issue')
        verbose_name_plural = _('Print issues')

    def __str__(self):
        return self.issue_name

    def save(self, *args, **kwargs):
        if self.pk:
            old_self = type(self).objects.get(pk=self.pk)
        else:
            old_self = PrintIssue()
        if self.pdf and old_self.pdf != self.pdf:
            reader = PdfFileReader(self.pdf)
            self.pages = reader.numPages
            self.text = reader.getPage(0).extractText()[:200]
            self.cover_page.delete()
        if not self.pdf and self.cover_page:
            self.cover_page.delete()
        if self.pdf and not self.publication_date:
            self.publication_date = self.get_publication_date()

        super().save(*args, **kwargs)

    def create_thumbnail(self):
        """ Create a jpg version of the pdf frontpage """
        pdf_name = self.pdf.path
        cover_page = pdf_name.replace(
            '.pdf', '.jpg').replace(
            'pdf/', 'pdf/covers/')
        img = WandImage(filename=pdf_name + '[0]', resolution=60)
        bg = WandImage(
            width=img.width,
            height=img.height,
            background=Color('white'))
        bg.composite(img, 0, 0)
        bg.save(filename=cover_page)
        self.cover_page = cover_page
        self.save()

    def get_thumbnail(self):
        """ Get or create a jpg version of the pdf frontpage """
        pdf = self.pdf
        cover = self.cover_page
        if not pdf:
            return None
        if cover and os.path.isfile(cover.path):
            # There is a cover thumb
            timestamp = os.path.getmtime
            if timestamp(cover.path) > timestamp(pdf.path):
                # Pdf has not changed
                return self.cover_page

        self.create_thumbnail()
        return self.cover_page

    def extract_page_text(self, page_number):
        """ Extracts text from a page in the pdf """
        pdf_file = PdfFileReader(self.pdf, strict=True)
        text = pdf_file.getPage(page_number - 1).extractText()
        return text

    def get_publication_date(self):
        page_2_text = self.extract_page_text(2)
        dateline_regex = r'^\d(?P<day>\w+) (?P<date>\d{1,2})\. (?P<month>\w+) (?P<year>\d{4})'
        MONTHS = ['januar', 'februar', 'mars', 'april', 'mai', 'juni',
                  'juli', 'august', 'september', 'oktober', 'november', 'desember']
        dateline = re.match(dateline_regex, page_2_text)
        if dateline:
            day = int(dateline.group('date'))
            year = int(dateline.group('year'))
            month = MONTHS.index(dateline.group('month')) + 1
            created = datetime.date(day=day, month=month, year=year)
        else:
            # Finds creation date.
            created = datetime.date.fromtimestamp(
                os.path.getmtime(self.pdf.path))
            # Sets creation date as a Wednesday, if needed.
            created = created + datetime.timedelta(
                days=3 - created.isoweekday())
        return created

    # @models.permalink
    def get_absolute_url(self):
        return self.pdf.url
