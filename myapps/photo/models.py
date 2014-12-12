# -*- coding: utf-8 -*-
""" Photography and image files in the publication  """
# Python standard library
# import os
import re
import numpy
import cv2

# Django core
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.core.validators import MaxValueValidator, MinValueValidator
# Installed apps

from model_utils.models import TimeStampedModel
from sorl.thumbnail import ImageField

# Project apps
from myapps.contributors.models import Contributor

import logging
logger = logging.getLogger('universitas')


class ImageFile(TimeStampedModel):
    CROP_NONE = 0
    CROP_FEATURES = 5
    CROP_FACES = 10
    CROP_MANUAL = 100

    CROP_CHOICES = (
        (CROP_NONE, _('center')),
        (CROP_FEATURES, _('feature detection')),
        (CROP_FACES, _('face detection')),
        (CROP_MANUAL, _('manual crop')),
    )

    class Meta:
        verbose_name = _('ImageFile')
        verbose_name_plural = _('ImageFiles')

    source_file = ImageField(
        upload_to='',
        height_field='full_height',
        width_field='full_width',
        max_length=1024,
    )
    full_height = models.PositiveIntegerField(
        help_text=_('full height in pixels'),
        verbose_name=_('full height'),
        editable=False,
    )
    full_width = models.PositiveIntegerField(
        help_text=_('full height in pixels'),
        verbose_name=_('full height'),
        editable=False,
    )
    vertical_centre = models.PositiveSmallIntegerField(
        default=50,
        help_text=_('image crop vertical. Between 0% and 100%.'),
        validators=[MaxValueValidator(100), MinValueValidator(0)],
    )
    horizontal_centre = models.PositiveSmallIntegerField(
        default=50,
        help_text=_('image crop horizontal. Between 0% and 100%.'),
        validators=[MaxValueValidator(100), MinValueValidator(0)],
    )
    cropping_method = models.PositiveSmallIntegerField(
        choices=CROP_CHOICES,
        default=CROP_CHOICES[0][0],
        help_text=_('How this image has been cropped.'),
    )
    old_file_path = models.CharField(
        help_text=_('previous path if the image has been moved.'),
        blank=True, null=True,
        max_length=1000)
    contributor = models.ForeignKey(
        Contributor,
        help_text=_('who made this'),
        blank=True, null=True,
    )
    copyright_information = models.CharField(
        help_text=_('extra information about license and attribution if needed.'),
        blank=True, null=True,
        max_length=1000,
    )

    def get_crop(self):
        if self.cropping_method == self.CROP_NONE:
            self.autocrop()
        return '{h}% {v}%'.format(h=self.horizontal_centre, v=self.vertical_centre)

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
                logger.warning(self, initials, e)

        return None

    def save(self, *args, **kwargs):
        if self.contributor is None:
            pass
            # self.contributor = self.identify_photo_file_initials()
        if self.pk and not kwargs.pop('autocrop', False):
            try:
                saved = type(self).objects.get(id=self.pk)
                if (self.horizontal_centre, self.vertical_centre) != (saved.horizontal_centre, saved.vertical_centre):
                    self.cropping_method = self.CROP_MANUAL
            except ImageFile.DoesNotExist:
                pass
        super().save(*args, **kwargs)

    def opencv_image(self, size=400, grayscale=True):
        """ Convert ImageFile into a cv2 image for image processing. """
        cv2img = cv2.imread(self.source_file.file.name)

        width, height = cv2img.shape[0], cv2img.shape[1]
        if width > height:
            height, width = size * height // width, size
        else:
            height, width = size, size * width // height

        cv2img = cv2.resize(cv2img, (height, width))
        if grayscale:
            cv2img = cv2.cvtColor(cv2img, cv2.COLOR_BGR2GRAY)
        return cv2img

    def autocrop(self):
        """ Calculates best crop using a clever algorithm. """
        def main():
            """ Try different algorithms, change crop and save model. """
            grayscale_image = self.opencv_image()
            centre = detect_faces(grayscale_image)
            if centre:
                self.cropping_method = self.CROP_FACES
            else:
                centre = detect_features(grayscale_image)
                self.cropping_method = self.CROP_FEATURES

            self.horizontal_centre = round(100 * centre[0] / grayscale_image.shape[0])
            self.vertical_centre = round(100 * centre[1] / grayscale_image.shape[1])
            self.save(autocrop=True)

        def detect_faces(cv2img):
            """ Detects faces in image and adjust cropping. """
            # datafolder = ''
            face_cascade = cv2.CascadeClassifier('myapps/photo/haarcascade_frontalface_default.xml')
            faces = face_cascade.detectMultiScale(cv2img, 1.3, 5)
            horizontal_faces, vertical_faces = [], []
            for (face_x, face_y, face_w, face_h) in faces:
                # Create weighted sum here.
                horizontal_faces.extend([face_y + face_h / 2] * face_h)
                vertical_faces.extend([face_x + face_w / 2] * face_w)

            if horizontal_faces:
                horizontal_centre = sum(horizontal_faces) / len(horizontal_faces)
                vertical_centre = sum(vertical_faces) / len(vertical_faces)
                return horizontal_centre, vertical_centre
            else:
                # No faces found
                return None

        def detect_features(cv2img):
            """ Detect features in the image to determine cropping """
            corners = cv2.goodFeaturesToTrack(cv2img, 25, 0.01, 10)
            corners = numpy.int0(corners)
            horizontal_centre = corners.ravel()[::2].mean()
            vertical_centre = corners.ravel()[1::2].mean()

            return horizontal_centre, vertical_centre

        main()
