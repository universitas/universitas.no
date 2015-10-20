# -*- coding: utf-8 -*FIELDNAME = forms.SlugField()-
""" Photography and image files in the publication  """
# Python standard library
# import os
import re
import os

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
from .autocrop import AutoCropImage, Cropping
import logging
logger = logging.getLogger(__name__)


def upload_image_to(instance, filename):
    return os.path.join(
        instance.upload_folder(),
        instance.slugify(filename)
    )

class ImageFile(TimeStampedModel, Edit_url_mixin, AutoCropImage):

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
        if self.source_file:
            return os.path.basename(self.source_file.name)
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
    def upload_folder(cls):
        issue = current_issue()
        return os.path.join(str(issue.date.year), str(issue.number))

    @staticmethod
    def slugify(filename):
        slugify = Slugify(safe_chars='.-', separator='-')
        slugs = slugify(filename).split('.')
        slugs[-1] = slugs[-1].lower().replace('jpeg', 'jpg')
        slug = '.'.join(segment.strip('-') for segment in slugs)
        return slug

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




class ProfileImage(ImageFile):

    class Meta:
        proxy = True
        verbose_name = _('Profile Image')
        verbose_name_plural = _('Profile Images')

    UPLOAD_FOLDER = 'byline-photo'

    @staticmethod
    def slugify(filename):
        return ImageFile.slugify(filename.title())

    @staticmethod
    def upload_folder():
        return ProfileImage.UPLOAD_FOLDER


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
