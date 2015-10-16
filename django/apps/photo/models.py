# -*- coding: utf-8 -*FIELDNAME = forms.SlugField()-
""" Photography and image files in the publication  """
# Python standard library
# import os
import re
import numpy
import cv2
import os
from collections import namedtuple

# Django core
from django.db import models
from django.utils.translation import ugettext_lazy as _
# from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models.signals import pre_delete, post_save
# Installed apps

from model_utils.models import TimeStampedModel
from utils.model_mixins import Edit_url_mixin
from sorl import thumbnail

from slugify import Slugify

# Project apps
from apps.issues.models import current_issue

import logging
logger = logging.getLogger(__name__)
slugify_filename = Slugify(safe_chars='.-', separator='-')

CASCADE_FILE = os.path.join(
    os.path.dirname(__file__),
    'haarcascade_frontalface_default.xml'
)

Cropping = namedtuple('Cropping', ['top', 'left', 'diameter'])


def upload_image_to(instance, filename):
    filename = slugify_filename(filename)
    filename = re.sub(r'\.(jpg|jpeg)$', '.jpg', filename, flags=re.IGNORECASE)
    return os.path.join(instance.image_upload_folder(), filename)


class ImageFile(TimeStampedModel, Edit_url_mixin):
    CROP_NONE = 0
    CROP_FEATURES = 5
    CROP_PORTRAIT = 15
    CROP_FACES = 10
    CROP_MANUAL = 100

    CROP_CHOICES = (
        (CROP_NONE, _('center')),
        (CROP_FEATURES, _('corner detection')),
        (CROP_FACES, _('multiple faces')),
        (CROP_PORTRAIT, _('single face')),
        (CROP_MANUAL, _('manual crop')),
    )

    class Meta:
        verbose_name = _('ImageFile')
        verbose_name_plural = _('ImageFiles')

    source_file = thumbnail.ImageField(
        upload_to=upload_image_to,
        height_field='full_height',
        width_field='full_width',
        max_length=1024,
    )
    full_height = models.PositiveIntegerField(
        help_text=_('full height in pixels'),
        verbose_name=_('full height'),
        null=True, editable=False,
    )
    full_width = models.PositiveIntegerField(
        help_text=_('full height in pixels'),
        verbose_name=_('full height'),
        null=True, editable=False,
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
    crop_diameter = models.PositiveSmallIntegerField(
        default=100,
        help_text=_(
            'area containing most relevant content. Area is considered a '
            'circle with center x,y and diameter d where x and y are the '
            'values "from_left" and "from_right" and d is a percentage of '
            'the shortest axis. This is used for close cropping of some '
            'images, for instance byline photos.'
        ),
        validators=[
            MaxValueValidator(100),
            MinValueValidator(0)],
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
        'contributors.Contributor',
        help_text=_('who made this'),
        blank=True, null=True,
    )

    copyright_information = models.CharField(
        help_text=_(
            'extra information about license and attribution if needed.'),
        blank=True,
        null=True,
        max_length=1000,
    )

    def __str__(self):
        # file name only
        if self.source_file:
            return self.source_file.name.rpartition('/')[-1]
        else:
            return super(ImageFile, self).__str__()

    def save(self, *args, **kwargs):
        pk = self.pk
        if self.contributor is None:
            pass
            # self.contributor = self.identify_photo_file_initials()
        if pk and not kwargs.pop('autocrop', False):
            try:
                saved = type(self).objects.get(id=self.pk)
                if (self.from_left,
                    self.from_top) != (saved.from_left,
                                       saved.from_top):
                    self.cropping_method = self.CROP_MANUAL
            except ImageFile.DoesNotExist:
                pass
        super().save(*args, **kwargs)
        if not pk and self.cropping == self.CROP_NONE:
            self.autocrop()

    @classmethod
    def image_upload_folder(cls):
        issue = current_issue()
        return os.path.join(str(issue.date.year), str(issue.number))

    def thumb(self, height=315, width=600):
        geometry = '{}x{}'.format(width, height)
        try:
            return thumbnail.get_thumbnail(
                self.source_file,
                geometry,
                crop=self.get_crop()).url
        except Exception as e:
            msg = 'Thumbnail failed: {} {}'.format(e, self.source_file)
            logger.warn(msg)
            return self.source_file

    @property
    def cropping(self):
        return Cropping(
            top=self.from_top,
            left=self.from_left,
            diameter=self.crop_diameter)

    @cropping.setter
    def cropping(self, crop):
        self.from_top = crop.top
        self.from_left = crop.left
        self.crop_diameter = crop.diameter

    @cropping.deleter
    def cropping(self):
        field_names = (
            'from_top', 'from_left', 'crop_diameter', 'cropping_method')
        for field_name in field_names:
            field = self._meta.get_field(field_name)
            setattr(self, field.name, field.default)

    def get_crop(self):
        """ return center point of image in percent from top and left. """
        if self.cropping_method == self.CROP_NONE:
            self.autocrop()
        return '{h}% {v}%'.format(h=self.from_left, v=self.from_top)

    # def identify_photo_file_initials(self, contributors=(),):
    #     """
    #     If passed a file path that matches the Universitas format for photo credit.
    #     Searches database or optional iterable of contributors for a person that
    #     matches initials at end of jpg-file name
    #     """
    #     from apps.contributors.models import Contributor
    #     filename_pattern = re.compile(r'^.+[-_]([A-ZÆØÅ]{2,5})\.jp.?g$')
    #     match = filename_pattern.match(self.source_file.name)
    #     if match:
    #         initials = match.groups()[0]
    #         for contributor in contributors:
    #             if contributor.initials == initials:
    #                 return contributor
    #         try:
    #             return Contributor.objects.get(initials=initials)
    #         except (ObjectDoesNotExist, MultipleObjectsReturned) as e:
    #             logger.warning(self, initials, e)

    #     return None

    def opencv_image(self, size=400):
        """ Convert ImageFile into a cv2 image for image processing. """
        source = self.source_file.file
        source.seek(0)
        nparr = numpy.fromstring(source.read(), numpy.uint8)
        source.close()

        cv2img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        cv2img = cv2.cvtColor(cv2img, cv2.COLOR_BGR2RGB)
        width, height = cv2img.shape[0], cv2img.shape[1]
        if width > height:
            height, width = size * height // width, size
        else:
            height, width = size, size * width // height

        cv2img = cv2.resize(cv2img, (height, width))
        return cv2img

    def autocrop(self):
        """
        Calculates best crop using a clever algorithm,
        and saves Image with new data.
        """
        def main():
            """ Try different algorithms, change crop and save model. """
            try:
                grayscale_image = cv2.cvtColor(
                    self.opencv_image(), cv2.COLOR_RGB2GRAY)
            except AttributeError as e:  # No file access?
                warning = 'Autocrop failed {} {}'.format(e, self)
                logger.warn(warning)
                return
            cropping, faces = detect_faces(grayscale_image)
            if faces == 1:
                self.cropping_method = self.CROP_PORTRAIT
            elif faces > 1:
                self.cropping_method = self.CROP_FACES
            else:
                cropping = detect_features(grayscale_image)
                self.cropping_method = self.CROP_FEATURES

            left = int(
                round(
                    100 *
                    cropping.left /
                    grayscale_image.shape[1]))
            top = int(
                round(
                    100 *
                    cropping.top /
                    grayscale_image.shape[0]))
            diameter = int(
                round(
                    100 *
                    cropping.diameter /
                    min(grayscale_image.shape)))

            diameter = min(100, diameter)

            self.cropping = Cropping(left=left, top=top, diameter=diameter)
            self.save(autocrop=True)
            msg = 'Autocrop ({x:2.0f}, {y:2.0f}) {met:18} {pk} {file}'.format(
                file=self,
                met=self.get_cropping_method_display(),
                pk=self.pk,
                x=self.from_left,
                y=self.from_top,
                # diameter=self.crop_diameter
            )
            logger.debug(msg)
            del(grayscale_image)  # Might save some memory?

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
            box = {}
            for (face_left, face_top, face_width, face_height) in faces:
                # Create weighted average of faces. Bigger is heavier.
                horizontal_faces.extend(
                    [face_left + face_width / 2] * face_width)
                vertical_faces.extend(
                    [face_top + face_height / 2] * face_height)

                face_right = face_left + face_width
                face_bottom = face_top + face_height
                box['left'] = min(
                    face_left, box.get('left', face_left))
                box['top'] = min(
                    face_top, box.get('top', face_top))
                box['right'] = max(
                    face_right, box.get('right', face_right))
                box['bottom'] = max(
                    face_bottom, box.get('bottom', face_bottom))

            if horizontal_faces:
                left = sum(horizontal_faces) / len(horizontal_faces)
                top = sum(vertical_faces) / len(vertical_faces)
                diameter = max(
                    box['right'] - box['left'],
                    box['bottom'] - box['top']
                )
                return Cropping(
                    left=left, top=top, diameter=diameter), len(faces)
            else:
                # No faces found
                return None, len(faces)

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
            xx = corners.ravel()[0::2]
            yy = corners.ravel()[1::2]
            w = max(xx) - min(xx)
            h = max(yy) - min(yy)
            d = max(w, h)
            x = xx.mean()
            y = yy.mean()
            return Cropping(left=x, top=y, diameter=d)

        main()


class ProfileImage(ImageFile):

    class Meta:
        proxy = True
        verbose_name = _('Profile Image')
        verbose_name_plural = _('Profile Images')

    UPLOAD_FOLDER = 'byline-photo'

    @classmethod
    def image_upload_folder(cls):
        return cls.UPLOAD_FOLDER


def remove_imagefile_and_thumbnail(sender, instance, **kwargs):
    """Remove image file"""
    thumbnail.delete(instance.source_file, delete_file=True)
    # instance.source_file.delete()

def remove_thumbnail(sender, instance, **kwargs):
    thumbnail.delete(instance.source_file, delete_file=False)

pre_delete.connect(remove_imagefile_and_thumbnail, sender=ImageFile)
pre_delete.connect(remove_imagefile_and_thumbnail, sender=ProfileImage)
post_save.connect(remove_thumbnail, sender=ProfileImage)
post_save.connect(remove_thumbnail, sender=ProfileImage)
