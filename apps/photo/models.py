# -*- coding: utf-8 -*-
# Python standard library
import os

# Django core
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.conf import settings

# Installed apps
from model_utils.models import TimeStampedModel

# Project apps
from apps.contributors.models import Contributor



class ImageFile(TimeStampedModel):
    # TODO: Define fields here

    class Meta:
        verbose_name = _('ImageFile')
        verbose_name_plural = _('ImageFiles')

    source_file = models.ImageField(
        upload_to='upload/',
        height_field='full_height',
        width_field='full_width',
        max_length=1024,
    )
    full_height = models.PositiveIntegerField(editable=False)
    full_width = models.PositiveIntegerField(editable=False)
    old_file_path = models.CharField(
        help_text=_('previous path if the image has been moved.'),
        blank=True, null=True,
        max_length=100)

    def __unicode__(self):
        return '{}'.format(self.source_file)

    # def thumb(self):
        # TODO: Thumbnail-function. Det er nok bedre å bruke en tredjepart-app.

    # def save(self):
        # pass


