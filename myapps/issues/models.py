# -*- coding: utf-8 -*-
""" Content in the publication. """

# Python standard library
# import subprocess

# Django core
from django.utils.translation import ugettext_lazy as _
from django.db import models
# from django.utils.text import slugify

# Installed apps
from PyPDF2 import PdfFileReader
from sorl.thumbnail import ImageField
# Project apps

def next_issue():
    name = 33
    year = 2014
    return (year, name)
    # TODO: issues.models.next_issue() er fake. Må finne neste utgave fra databasen i stedet.

class PrintIssue(models.Model):

    """ An printed issue of the publication. """

    issue_name = models.CharField(max_length=50)
    publication_date = models.DateField()
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
        if self.pdf and (not self.cover_page or old_self.pdf != self.pdf):
            pdf_file = PdfFileReader(self.pdf)
            self.pages = pdf_file.numPages
            self.text = pdf_file.getPage(0).extractText()
            super().save(*args, **kwargs)
            self.create_thumbnail()
        if not self.pdf:
            self.cover_page.delete()
        super().save(*args, **kwargs)

    def create_thumbnail(self, overwrite=False):
        if self.cover_page and not overwrite:
            return
        pdf = self.pdf.file.name
        cover = pdf.replace('.pdf', '.jpg').replace('pdf/', 'pdf/covers/')
        params = [
            'convert', '-density', '160', pdf+'[0]',
            '-resize', '400x', '-background', 'white', cover,
        ]
        # import ipdb; ipdb.set_trace()
        # subprocess.Popen(params)
        self.cover_page = self.pdf.name.replace('.pdf', '.jpg').replace('pdf/', 'pdf/covers/')


    # @models.permalink
    def get_absolute_url(self):
        return self.pdf.url
