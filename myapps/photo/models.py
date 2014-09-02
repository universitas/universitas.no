# -*- coding: utf-8 -*-
# Python standard library
# import os
import re

# Django core
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
# from django.conf import settings
# Installed apps
from model_utils.models import TimeStampedModel
from sorl.thumbnail import ImageField
# Project apps
from myapps.contributors.models import Contributor


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
        # file name only
        return self.source_file.name.rpartition('/')[-1]

    def identify_photo_file_initials(self, contributors=(),):
        """
        If passed a file path that matches the Universitas format for photo credit.
        Searches database or optional iterable of contributors for a person that
        matches initials at end of jpg-file name
        """
        filename_pattern = re.compile(r'^.+[-_]([A-ZÆØÅ]{2,5})\.jp.?g$')
        match = filename_pattern.match(self.source_file.name)
        if match:
            initials = match.groups()[0]
            for contributor in contributors:
                if contributor.initials == initials:
                    return contributor
            try:
                return Contributor.objects.get(initials=initials)
            except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
                print(self, initials, e)

        return None
    def save(self, *args, **kwargs):
        if self.contributor is None:
            self.contributor = self.identify_photo_file_initials()
        super().save(*args, **kwargs)


