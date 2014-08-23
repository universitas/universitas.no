# -*- coding: utf-8 -*-
""" Content in the publication. """

# Python standard library

# Django core
from django.utils.translation import ugettext_lazy as _
from django.db import models
# from django.template.defaultfilters import slugify

# Installed apps

# Project apps


class PrintIssue(models.Model):

    """ An printed issue of the publication. """

    # issue_number = models.CharField(max_length=50)
    issue_name = models.CharField(max_length=50)
    publication_date = models.DateField()
    pages = models.IntegerField(help_text='Number of pages')
    pdf = models.FilePathField(
        help_text=_('Pdf file for this issue.'),
        blank=True, null=True,)
    cover_page = models.FilePathField(
        help_text=_('An image file of the front page'),
        blank=True, null=True,)

    class Meta:
        verbose_name = _('Print issue')
        verbose_name_plural = _('Print issues')

    def __str__(self):
        return self.issue_name

    # @models.permalink
    # def get_absolute_url(self):
        # return ('')



