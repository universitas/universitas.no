# -*- coding: utf-8 -*-
""" Content in the publication. """

# Python standard library
import re
import html

# Django core
from django.utils.translation import ugettext_lazy as _
from django.db import models

# Installed apps

# Project apps


class ProdsysTag(models.Model):

    """ Tag from prodsys """

    xtag = models.CharField(default='@tagname:', unique=True, max_length=50)
    html_tag = models.CharField(default='p', max_length=50)
    html_class = models.CharField(blank=True, null=True, max_length=50)

    class Meta:
        verbose_name = _('prodsys tag')
        verbose_name_plural = _('prodsys tags')
        app_label = 'stories'

    def __str__(self):
        """ unicode  """
        return self.xtag

    def save(self, *args, **kwargs):
        if not self.pk and not self.html_class:
            self.html_class = self.xtag
        super(ProdsysTag, self).save(*args, **kwargs)

    def wrap(self, content):
        """ Wrap string in html for this tag """
        content = html.escape(content)
        if self.html_class is None:
            block = '<%s>%s</%s>' % (self.html_tag, content, self.html_tag)
        else:
            block = '<%s class="%s">%s</%s>' % (self.html_tag, self.html_class, content, self.html_tag)
        return block

    @classmethod
    def wrap_text(cls, xtag, content):
        """ Wrap text in html tags even if tag does not exist yet. """
        # TODO: Prodsystag.wrap_text() bør gjøres i en utilityfunksjon som ikke misbruker databasen så mye.

        tag = ProdsysTag.objects.get_or_create(xtag=xtag)[0]
        return tag.wrap(content)

