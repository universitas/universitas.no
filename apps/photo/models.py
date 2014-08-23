# -*- coding: utf-8 -*-
# Python standard library
import os

# Django core
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.conf import settings

# Installed apps
from model_utils.models import TimeStampedModel
from sorl.thumbnail import ImageField
# Project apps
from apps.contributors.models import Contributor



class ImageFile(TimeStampedModel):
    # TODO: Define fields here

    class Meta:
        verbose_name = _('ImageFile')
        verbose_name_plural = _('ImageFiles')

    source_file = ImageField(
        upload_to='',
        height_field='full_height',
        width_field='full_width',
        max_length=1024,
    )
    full_height = models.PositiveIntegerField(editable=False)
    full_width = models.PositiveIntegerField(editable=False)
    old_file_path = models.CharField(
        help_text=_('previous path if the image has been moved.'),
        blank=True, null=True,
        max_length=1000)
    contributor = models.ForeignKey(
        Contributor,
        help_text=_('who made this.'),
        blank=True, null=True,
        )
    copyright_information = models.CharField(
        help_text=_('If needed.'),
        blank=True, null=True,
        max_length=1000,)

    def __str__(self):
        return self.source_file.name

    # def save(self):
        # pass


