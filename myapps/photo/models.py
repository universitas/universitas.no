# -*- coding: utf-8 -*-
""" Photography and image files in the publication  """
# Python standard library
# import os
import re
import numpy
import cv2
import os

# Django core
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.core.validators import MaxValueValidator, MinValueValidator
# Installed apps

from model_utils.models import TimeStampedModel
from utils.model_mixins import Edit_url_mixin
from sorl.thumbnail import ImageField

# Project apps
from myapps.contributors.models import Contributor

import logging
logger = logging.getLogger('universitas')

CASCADE_FILE = os.path.join(
    os.path.dirname(__file__),
    'haarcascade_frontalface_default.xml'
)


class ImageFile(TimeStampedModel, Edit_url_mixin):
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
    from_top = models.PositiveSmallIntegerField(
        default=50,
        help_text=_('image crop vertical. Between 0% and 100%.'),
        validators=[MaxValueValidator(100), MinValueValidator(0)],
    )
    from_left = models.PositiveSmallIntegerField(
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
        blank=True,
        null=True,
        max_length=1000,
    )

    def get_crop(self):
        if self.cropping_method == self.CROP_NONE:
            self.autocrop()
        return '{h}% {v}%'.format(h=self.from_left, v=self.from_top)

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
                if (self.from_left,
                    self.from_top) != (saved.from_left,
                                       saved.from_top):
                    self.cropping_method = self.CROP_MANUAL
            except ImageFile.DoesNotExist:
                pass
        super().save(*args, **kwargs)

    def opencv_image(self, size=400, grayscale=True):
        """ Convert ImageFile into a cv2 image for image processing. """
        filename = self.source_file.file.name
        color_mode = cv2.IMREAD_GRAYSCALE if grayscale else cv2.IMREAD_UNCHANGED
        cv2img = cv2.imread(filename, color_mode)

        self.source_file.close()  # cv2 doesn't close the file for some reason.

        width, height = cv2img.shape[0], cv2img.shape[1]
        if width > height:
            height, width = size * height // width, size
        else:
            height, width = size, size * width // height

        cv2img = cv2.resize(cv2img, (height, width))
        # if grayscale:
            # cv2img = cv2.cvtColor(cv2img, cv2.COLOR_BGR2GRAY)
        return cv2img

    def autocrop(self):
        """ Calculates best crop using a clever algorithm. """
        def main():
            """ Try different algorithms, change crop and save model. """
            try:
                grayscale_image = self.opencv_image()
            except AttributeError as e:  # No file access?
                warning = 'Autocrop failed {} {}'.format(e, self)
                logger.error(warning)
                return
            centre = detect_faces(grayscale_image)
            if centre:
                self.cropping_method = self.CROP_FACES
            else:
                centre = detect_features(grayscale_image)
                self.cropping_method = self.CROP_FEATURES

            self.from_left = int(
                round(
                    100 *
                    centre[0] /
                    grayscale_image.shape[1]))
            self.from_top = int(
                round(
                    100 *
                    centre[1] /
                    grayscale_image.shape[0]))
            self.save(autocrop=True)
            warning = 'Autocrop  ({left:2.0f}, {top:2.0f})  {method:18} {pk} {file}'.format(
                file=self,
                method=self.get_cropping_method_display(),
                pk=self.pk,
                left=self.from_left,
                top=self.from_top)
            logger.debug(warning)
            del(grayscale_image)  # Hjelper kanskje?

        def detect_faces(cv2img):
            """ Detects faces in image and adjust cropping. """
            # http://docs.opencv.org/trunk/modules/objdetect/doc/cascade_classification.html
            # cv2.CascadeClassifier.detectMultiScale(image[, scaleFactor[, minNeighbors[, flags[, minSize[, maxSize]]]]])
                # cascade – Haar classifier cascade (OpenCV 1.x API only). It can be loaded from XML or YAML file using Load(). When the cascade is not needed anymore, release it using cvReleaseHaarClassifierCascade(&cascade).
                # image – Matrix of the type CV_8U containing an image where objects are detected.
                # objects – Vector of rectangles where each rectangle contains the detected object, the rectangles may be partially outside the original image.
                # numDetections – Vector of detection numbers for the corresponding objects. An object’s number of detections is the number of neighboring positively classified rectangles that were joined together to form the object.
                # scaleFactor – Parameter specifying how much the image size is reduced at each image scale.
                # minNeighbors – Parameter specifying how many neighbors each candidate rectangle should have to retain it.
                # flags – Parameter with the same meaning for an old cascade as in the function cvHaarDetectObjects. It is not used for a new cascade.
                # minSize – Minimum possible object size. Objects smaller than that are ignored.
                # maxSize – Maximum possible object size. Objects larger than that are ignored.
                # outputRejectLevels – Boolean. If True, it returns the
                # rejectLevels and levelWeights. Default value is False.

            face_cascade = cv2.CascadeClassifier(CASCADE_FILE)
            faces = face_cascade.detectMultiScale(cv2img,)
            horizontal_faces, vertical_faces = [], []
            for (face_left, face_top, face_width, face_height) in faces:
                # Create weighted average of faces. Bigger is heavier.
                horizontal_faces.extend(
                    [face_left + face_width / 2] * face_width)
                vertical_faces.extend(
                    [face_top + face_height / 2] * face_height)

            if horizontal_faces:
                from_left = sum(horizontal_faces) / len(horizontal_faces)
                from_top = sum(vertical_faces) / len(vertical_faces)
                return from_left, from_top
            else:
                # No faces found
                return None

        def detect_features(cv2img):
            """ Detect features in the image to determine cropping """
            # http://docs.opencv.org/trunk/modules/imgproc/doc/feature_detection.html
            # cv2.goodFeaturesToTrack(image, maxCorners, qualityLevel, minDistance[, corners[, mask[, blockSize[, useHarrisDetector[, k]]]]]) → corners
                # image – Input 8-bit or floating-point 32-bit, single-channel image.
                # corners – Output vector of detected corners.
                # maxCorners – Maximum number of corners to return. If there are more corners than are found, the strongest of them is returned.
                # qualityLevel – Parameter characterizing the minimal accepted quality of image corners. The parameter value is multiplied by the best corner quality measure, which is the minimal eigenvalue (see cornerMinEigenVal() ) or the Harris function response (see cornerHarris() ). The corners with the quality measure less than the product are rejected. For example, if the best corner has the quality measure = 1500, and the qualityLevel=0.01 , then all the corners with the quality measure less than 15 are rejected.
                # minDistance – Minimum possible Euclidean distance between the returned corners.
                # mask – Optional region of interest. If the image is not empty (it needs to have the type CV_8UC1 and the same size as image ), it specifies the region in which the corners are detected.
                # blockSize – Size of an average block for computing a derivative covariation matrix over each pixel neighborhood. See cornerEigenValsAndVecs() .
                # useHarrisDetector – Parameter indicating whether to use a Harris detector (see cornerHarris()) or cornerMinEigenVal().
                # k – Free parameter of the Harris detector.

            corners = cv2.goodFeaturesToTrack(cv2img, 25, 0.01, 10)
            corners = numpy.int0(corners)
            from_left = corners.ravel()[::2].mean()
            from_top = corners.ravel()[1::2].mean()

            return from_left, from_top

        main()
