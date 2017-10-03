import logging
import os
from pathlib import Path

import boto
import imagehash

from django.core.files import File
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from .file_operations import get_imagehash, get_md5

logger = logging.getLogger(__name__)


def get_sourcefile_modification_time(img):
    """Modified time as unix timestamp"""
    try:
        try:  # Locally stored file
            timestamp = Path(img.path).stat().st_mtime
            mtime = timezone.datetime.fromtimestamp(timestamp)
        except NotImplementedError:  # AWS S3 storage
            timestamp = img.file.key.last_modified
            mtime = boto.utils.parse_ts(timestamp)
    except (FileNotFoundError, AttributeError):
        # return current time
        mtime = timezone.now()
    return int(mtime.strftime('%s'))


def s3_md5(s3key, blocksize=65536):
    """Hexadecimal md5 hash of a file stored in Amazon S3"""
    return s3key.etag.strip('"').strip("'")


class ImageHashModelMixin(models.Model):
    class Meta:
        abstract = True

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

    def save(self, *args, **kwargs):
        self.calculate_hashes()
        super().save(*args, **kwargs)

    def save_local_image_as_source(self, filepath: Path, save=True):
        """Save file from local filesystem as source

        Only saves if the new file is different from the one that exists.
        """
        mtime = filepath.stat().st_mtime
        size = filepath.stat().st_size
        md5 = get_md5(filepath)
        if self.pk and self.original:
            if mtime <= self.mtime or (size, md5) == (self.size, self.md5):
                return False
        self.mtime = mtime
        self.size = size
        self.md5 = md5
        self.imagehash = get_imagehash(filepath)
        self.original.save(filepath.name, File(filepath.open('rb')), save)
        return True

    @property
    def md5(self):
        """Calculate or retrieve md5 value"""
        if self.original and self._md5 is None:
            self._md5 = get_md5(self.original)
        return self._md5

    @md5.setter
    def md5(self, value):
        self._md5 = value if value else None

    @property
    def imagehash(self):
        """Calculate or retrieve imagehash value."""
        if not self._imagehash and self.original:
            try:
                self.imagehash = get_imagehash(self.large)
            except FileNotFoundError:
                self.imagehash = get_imagehash(self.original)
        try:
            return imagehash.hex_to_hash(self._imagehash)
        except ValueError:
            # could not calculate imagehash
            return imagehash.hex_to_hash('F' * 16)

    @imagehash.setter
    def imagehash(self, value):
        self._imagehash = str(value) if value else ''

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
            self._mtime = get_sourcefile_modification_time(self)
        return self._mtime

    @mtime.setter
    def mtime(self, timestamp):
        self._mtime = timestamp

    def calculate_hashes(self):
        """Make sure the image has size, mtime, md5 and imagehash"""
        fields = ['_mtime', '_md5', '_size', '_imagehash', 'modified']
        if all(getattr(self, f) for f in fields):
            return False
        # calculate values
        updated = self.mtime, self.md5, self.size, self.imagehash
        assert all(updated), f'All {fields} should have a value'

        if self.pk is not None:
            # save unless instance does not exist already in db.
            self.save(update_fields=fields)
            logger.debug(f'updated hashes {self}')
        return True
