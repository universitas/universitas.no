# -*- coding: utf-8 -*-
""" Photography and image files in the publication  """
# Python standard library
# import os
import os
import hashlib
import logging

# Django core
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models.signals import pre_delete, post_save
from django.core.files import File
from django.conf import settings
# Installed apps

from model_utils.models import TimeStampedModel
from utils.model_mixins import Edit_url_mixin
from sorl import thumbnail
from slugify import Slugify
# from boto.utils import parse_ts
import boto

# Project apps
from apps.issues.models import current_issue
from .autocrop import AutoCropImage, Cropping
logger = logging.getLogger(__name__)


def local_md5(filepath, blocksize=65536):
    """Hexadecimal md5 hash of a file stored on local disk"""
    hasher = hashlib.md5()
    with open(filepath, 'rb') as source:
        buf = source.read(blocksize)
        while len(buf) > 0:
            hasher.update(buf)
            buf = source.read(blocksize)
    return hasher.hexdigest()


def file_field_md5(source_file, blocksize=65536):
    """Hexadecimal md5 hash of a django model.FileField"""
    hasher = hashlib.md5()
    if source_file.closed:
        source_file.open('rb')
    buf = source_file.read(blocksize)
    while len(buf) > 0:
        hasher.update(buf)
        buf = source_file.read(blocksize)
    source_file.seek(0)
    return hasher.hexdigest()


def s3_md5(s3key, blocksize=65536):
    """Hexadecimal md5 hash of a file stored in Amazon S3"""
    return s3key.etag.strip('"').strip("'")


def upload_image_to(instance, filename):
    return os.path.join(
        instance.upload_folder(),
        instance.slugify(filename)
    )


class ImageFileManager(models.Manager):

    def create_from_file(self, filepath, **kwargs):
        image = self.model(**kwargs)
        image.save_local_image_as_source(filepath)
        return image


class ImageFile(TimeStampedModel, Edit_url_mixin, AutoCropImage):

    class Meta:
        verbose_name = _('ImageFile')
        verbose_name_plural = _('ImageFiles')

    objects = ImageFileManager()

    source_file = thumbnail.ImageField(
        verbose_name=_('source file'),
        upload_to=upload_image_to,
        height_field='full_height',
        width_field='full_width',
        max_length=1024,
    )
    _md5 = models.CharField(
        verbose_name=_('md5'),
        help_text=_('md5 hash of source file'),
        max_length=32,
        editable=False,
        null=True,
    )
    _size = models.PositiveIntegerField(
        verbose_name=_('file size'),
        help_text=_('size of file in bytes'),
        editable=False,
        null=True,
    )
    _mtime = models.PositiveIntegerField(
        verbose_name=_('timestamp'),
        help_text=_('mtime timestamp of source file'),
        editable=False,
        null=True,
    )
    full_height = models.PositiveIntegerField(
        verbose_name=_('height'),
        help_text=_('full height in pixels'),
        null=True, editable=False,
    )
    full_width = models.PositiveIntegerField(
        verbose_name=_('width'),
        help_text=_('full height in pixels'),
        null=True, editable=False,
    )
    from_top = models.PositiveSmallIntegerField(
        verbose_name=_('from top'),
        default=50,
        help_text=_('image crop vertical. Between 0% and 100%.'),
        validators=[MaxValueValidator(100), MinValueValidator(0)],
    )
    from_left = models.PositiveSmallIntegerField(
        verbose_name=_('from left'),
        default=50,
        help_text=_('image crop horizontal. Between 0% and 100%.'),
        validators=[MaxValueValidator(100), MinValueValidator(0)],
    )
    crop_diameter = models.PositiveSmallIntegerField(
        verbose_name=_('crop diameter'),
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
        verbose_name=_('old file path'),
        help_text=_('previous path if the image has been moved.'),
        blank=True, null=True,
        max_length=1000)

    contributor = models.ForeignKey(
        'contributors.Contributor',
        verbose_name=_('contributor'),
        help_text=_('who made this'),
        blank=True, null=True,
    )

    copyright_information = models.CharField(
        verbose_name=_('copyright information'),
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
        if pk and not kwargs.pop('autocrop', False):
            self.md5 = None
            self.size = None
            self.mtime = None
            try:
                saved = type(self).objects.get(id=self.pk)
                if (self.from_left,
                    self.from_top) != (saved.from_left,
                                       saved.from_top):
                    self.cropping_method = self.CROP_MANUAL
            except ImageFile.DoesNotExist:
                pass
        if not pk:
            super().save(*args, **kwargs)
        assert self.size is not None
        assert self.md5 is not None
        assert self.mtime is not None
        super().save(*args, **kwargs)
        if pk is None and self.cropping == self.CROP_NONE:
            self.autocrop()

    def save_local_image_as_source(self, filepath, save=True):
        """Save file from local filesystem as source

        Only saves if the new file is different from the one that exists.
        """
        mtime = os.stat(filepath).st_mtime
        size = os.stat(filepath).st_size
        md5 = local_md5(filepath)
        if self.pk and self.source_file:
            if mtime <= self.mtime or (size, md5) == (self.size, self.md5):
                return False
        filename = os.path.split(filepath)[1]
        with open(filepath, 'rb') as source:
            content = File(source)
            self.source_file.save(filename, content, save)
        return True

    @property
    def md5(self):
        """Calculate or retrieve md5 value"""
        if self.source_file is None:
            return None
        if self._md5 is None:
            self._md5 = file_field_md5(self.source_file)
            # try:  # Locally stored file
            #     self._md5 = local_md5(self.source_file.path)
            # except NotImplementedError:  # AWS S3 storage
            #     self._md5 = s3_md5(self.source_file.file.key)
        return self._md5

    @md5.setter
    def md5(self, value):
        self._md5 = value

    @property
    def size(self):
        """Calculate or retrive filesize"""
        if self.source_file is None:
            return None
        if self._size is None:
            self._size = self.source_file.size
        return self._size

    @size.setter
    def size(self, value):
        self._size = value

    @property
    def mtime(self):
        """Modified time as unix timestamp"""
        if self.source_file is None:
            return None
        if self._mtime is None:
            try:
                try:  # Locally stored file
                    mtime = os.path.getmtime(self.source_file.path)
                    self._mtime = int(mtime)
                except NotImplementedError:  # AWS S3 storage
                    key = self.source_file.file.key
                    modified = boto.utils.parse_ts(key.last_modified)
                    self._mtime = int(modified.strftime('%s'))
            except (FileNotFoundError, AttributeError):
                self._mtime = int(timezone.now().strftime('%s'))
        return self._mtime

    @mtime.setter
    def mtime(self, timestamp):
        self._mtime = timestamp

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

    # def compare_and_update(self, filepath):
    #     """Check for changes and update stored source file if needed."""
    #     mtime = os.stat(filepath).st_mtime
    #     size = os.stat(filepath).st_size
    #     md5 = local_md5(filepath)
    #     if mtime > self.mtime and (size, md5) != (self.size, self.md5):
    #         self.mtime = mtime
    #         self.md5 = md5
    #         self.size = size
    #         self.source_file

    # def identify_photo_file_initials(self, contributors=(),):
    #     """Assign contributor to photo
    #
    #     If passed a file path that matches the Universitas format for photo
    #     credit. Searches database or optional iterable of contributors for a
    #     person that matches initials at end of jpg-file name
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
    delete_file = not settings.DEBUG  # only in production
    thumbnail.delete(instance.source_file, delete_file=delete_file)


def remove_thumbnail(sender, instance, **kwargs):
    thumbnail.delete(instance.source_file, delete_file=False)

pre_delete.connect(remove_imagefile_and_thumbnail, sender=ImageFile)
pre_delete.connect(remove_imagefile_and_thumbnail, sender=ProfileImage)
post_save.connect(remove_thumbnail, sender=ImageFile)
post_save.connect(remove_thumbnail, sender=ProfileImage)
