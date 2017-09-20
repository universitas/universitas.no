""" Photography and image files in the publication  """

# Python standard library
import os
import re
import hashlib
import logging
from io import BytesIO
from pathlib import Path

# Django core
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.core.validators import FileExtensionValidator
from django.core.files import File
from django.conf import settings

# Installed apps
from model_utils.models import TimeStampedModel
from utils.model_mixins import Edit_url_mixin
from sorl import thumbnail
from slugify import Slugify
import boto
import imagehash
import PIL

# Project apps
from apps.issues.models import current_issue
from .cropping.models import AutoCropImage

logger = logging.getLogger(__name__)

image_file_validator = FileExtensionValidator(['jpg', 'jpeg', 'png'])


class BrokenImage:
    """If thumbnail fails"""
    url = settings.STATIC_URL + 'admin/img/icon-no.svg'

    def read(self):
        return b''


def local_file_md5(filepath, blocksize=65536):
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
    """Image folder name based on issue number and year"""
    return os.path.join(
        instance.upload_folder(),
        instance.slugify(filename)
    )


class ImageFileQuerySet(models.QuerySet):
    def pending(self):
        return self.filter(
            cropping_method=self.model.CROP_PENDING)

    def photos(self):
        return self.exclude(
            source_file__startswith=ProfileImage.UPLOAD_FOLDER)

    def profile_images(self):
        return self.filter(
            source_file__startswith=ProfileImage.UPLOAD_FOLDER)

    def update_descriptions(self):
        count = 0
        for image in self:
            if image.description != image.add_description():
                count += 1
                image.save(update_fields=['description'])
        return count


class ImageFileManager(models.Manager):

    def create_from_file(self, filepath, **kwargs):
        image = self.model(**kwargs)
        image.save_local_image_as_source(filepath)
        return image


class ImageFile(TimeStampedModel, Edit_url_mixin, AutoCropImage):

    class Meta:
        verbose_name = _('ImageFile')
        verbose_name_plural = _('ImageFiles')

    objects = ImageFileManager.from_queryset(ImageFileQuerySet)()

    source_file = thumbnail.ImageField(
        verbose_name=_('source file'),
        validators=[image_file_validator],
        upload_to=upload_image_to,
        height_field='full_height',
        width_field='full_width',
        max_length=1024,
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
    _md5 = models.CharField(
        verbose_name=_('md5'),
        help_text=_('md5 hash of source file'),
        max_length=32,
        editable=False,
        null=True,
    )
    _imagehash = models.CharField(
        verbose_name=_('image hash'),
        help_text=_('perceptual hash of image using dhash algorithm'),
        max_length=16,
        editable=False,
        default='',
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

    old_file_path = models.CharField(
        verbose_name=_('old file path'),
        help_text=_('previous path if the image has been moved.'),
        blank=True, null=True,
        max_length=1000,
    )
    contributor = models.ForeignKey(
        'contributors.Contributor',
        verbose_name=_('contributor'),
        help_text=_('who made this'),
        blank=True, null=True,
    )
    description = models.CharField(
        verbose_name=_('copyright information'),
        help_text=_('Description of image'),
        default='',
        blank=True,
        null=False,
        max_length=1000,
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
        if self.original:
            return os.path.basename(self.original.name)
        else:
            return super(ImageFile, self).__str__()

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.md5
            self.size
            self._imagehash = str(self.calculate_image_hash())

        super().save(*args, **kwargs)

    def save_local_image_as_source(self, filepath, save=True):
        """Save file from local filesystem as source

        Only saves if the new file is different from the one that exists.
        """
        mtime = os.stat(filepath).st_mtime
        size = os.stat(filepath).st_size
        md5 = local_file_md5(filepath)
        if self.pk and self.original:
            if mtime <= self.mtime or (size, md5) == (self.size, self.md5):
                return False
        filename = os.path.split(filepath)[1]
        with open(filepath, 'rb') as source:
            content = File(source)
            self.original.save(filename, content, save)
        return True

    @property
    def md5(self):
        """Calculate or retrieve md5 value"""
        if self.original and self._md5 is None:
            self._md5 = file_field_md5(self.original)
        return self._md5

    @md5.setter
    def md5(self, value):
        self._md5 = value

    @property
    def imagehash(self):
        """Calculate or retrieve md5 value"""
        if self.original and self._imagehash is '':
            self.imagehash = self.calculate_image_hash()
        try:
            return imagehash.hex_to_hash(self._imagehash)
        except ValueError:
            # could not calculate imagehash
            return imagehash.hex_to_hash('F' * 16)

    @imagehash.setter
    def imagehash(self, value):
        self._imagehash = str(value)

    @property
    def size(self):
        """Calculate or retrive filesize"""
        if self.original and self._size is None:
            self._size = self.original.size
        return self._size

    @size.setter
    def size(self, value):
        self._size = value

    @property
    def mtime(self):
        if self.original and self._mtime is None:
            self._mtime = self.get_sourcefile_modification_time()
        return self._mtime

    @mtime.setter
    def mtime(self, timestamp):
        self._mtime = timestamp

    def get_sourcefile_modification_time(self):
        """Modified time as unix timestamp"""
        try:
            try:  # Locally stored file
                mtime = os.path.getmtime(self.original.path)
                return int(mtime)
            except NotImplementedError:  # AWS S3 storage
                key = self.original.file.key
                modified = boto.utils.parse_ts(key.last_modified)
                return int(modified.strftime('%s'))
        except (FileNotFoundError, AttributeError):
            # return current time
            return int(timezone.now().strftime('%s'))

    @classmethod
    def upload_folder(cls):
        try:
            issue = current_issue()
            year, number = issue.year, issue.number
        except Exception:
            year = timezone.now().year
            number = '0'
        return f'{year}/{number}'

    @classmethod
    def slugify(cls, filename):
        slugify = Slugify(safe_chars='.-', separator='-')
        slugs = slugify(filename).split('.')
        slugs[-1] = slugs[-1].lower().replace('jpeg', 'jpg')
        slug = '.'.join(segment.strip('-') for segment in slugs)
        return slug

    @property
    def original(self):
        return self.source_file

    @property
    def small(self):
        return self.thumbnail('200x200')

    @property
    def large(self):
        return self.thumbnail('1500x1500')

    @property
    def preview(self):
        """Return thumb of cropped image"""
        return self.thumbnail('150x150', crop_box=self.get_crop_box())

    def thumbnail(self, size='x150', **options):
        """Create thumb of image"""
        try:
            return thumbnail.get_thumbnail(self.original, size, **options)
        except Exception:
            logger.exception('Cannot create thumbnail')
            return BrokenImage()

    def download_from_aws(self, dest=Path('/var/media/')):
        """Download file for development server"""
        path = dest / self.original.name
        if path.exists():
            return
        data = self.original.file.read()
        path.parent.mkdir(0o775, True, True)
        path.write_bytes(data)

    def calculate_image_hash(self, size=11):
        """Calculate perceptual hash for comparison of identical images"""
        try:
            blob = BytesIO(self.large.read())
            img = PIL.Image.open(blob).convert('L').resize((size, size))
            return imagehash.dhash(img)
        except Exception as e:
            logger.exception('failed')
            return ''

    def save_again(self):
        """fix broken files. THIS IS HACK"""
        src = self.original
        filename = os.path.basename(src.name)
        content = File(src)
        src.save(filename, content)

    def is_profile_image(self):
        return self.original.name.startswith(ProfileImage.UPLOAD_FOLDER)

    def build_thumbs(self):
        """Make sure thumbs exists"""
        self.large
        self.small
        self.preview
        logger.info(f'built thumbs {self}')

    def calculate_hashes(self):
        """Make sure the image has size, mtime, md5 and imagehash"""
        if all([self._mtime, self._md5, self._size, self._imagehash]):
            return False
        # calculate values
        self.mtime
        self.md5
        self.size
        self.imagehash
        if self.pk is not None:
            # save unless instance does not exist already in db.
            self.save(update_fields=[
                'modified', '_mtime', '_md5', '_size', '_imagehash'])
            logger.info(f'updated hashes {self}')
        return True

    def add_description(self):
        """Populates `description` with relevant content from related models"""
        if self.is_profile_image():
            return ProfileImage.add_description(self)
        cap_list = self.storyimage_set.values_list('caption', flat=True)
        captions = [re.sub(r'/s+', ' ', c.strip()) for c in cap_list]
        self.description = '\n'.join(captions)[:1000]
        return self.description


class ProfileImageManager(ImageFileManager):
    def get_queryset(self):
        return super().get_queryset().profile_images()


class ProfileImage(ImageFile):

    class Meta:
        proxy = True
        verbose_name = _('Profile Image')
        verbose_name_plural = _('Profile Images')

    objects = ProfileImageManager.from_queryset(ImageFileQuerySet)()

    UPLOAD_FOLDER = 'byline-photo'

    def add_description(self):
        if self.person.count():
            self.description = self.person.first().display_name
        else:
            self.description = ''
        return self.description

    @classmethod
    def slugify(cls, filename):
        return super().slugify(filename.title())

    @classmethod
    def upload_folder(cls):
        return cls.UPLOAD_FOLDER

    @property
    def preview(self):
        """Return thumb of cropped image"""
        return self.thumbnail(
            size='150x150',
            crop_box=self.get_crop_box(),
            expand=0.2,
            colorspace='GRAY',
        )
