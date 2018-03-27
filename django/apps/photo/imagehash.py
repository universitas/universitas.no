import logging
from pathlib import Path

import boto
import imagehash

from django.contrib.postgres.fields import JSONField
from django.core.serializers.json import DjangoJSONEncoder
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

    _imagehash = models.CharField(
        verbose_name=_('image hash'),
        help_text=_('perceptual hash of image using dhash algorithm'),
        max_length=16,
        editable=False,
        default='',
    )
    stat = JSONField(
        encoder=DjangoJSONEncoder,
        verbose_name=_('stat'),
        help_text=_('file stats'),
        editable=False,
        default=lambda: dict(md5=None, size=None, mtime=None),
    )

    def save(self, *args, **kwargs):
        self.calculate_hashes()
        super().save(*args, **kwargs)

    @property
    def md5(self):
        """Calculate or retrieve md5 value"""
        if self.original and self.stat['md5'] is None:
            self.stat['md5'] = get_md5(self.original)
        return self.stat['md5']

    @md5.setter
    def md5(self, value):
        self.stat['md5'] = value if value else None

    @property
    def size(self):
        """Calculate or retrive filesize"""
        if self.original and self.stat['size'] is None:
            self.stat['size'] = self.original.size
        return self.stat['size']

    @size.setter
    def size(self, value):
        self.stat['size'] = value

    @property
    def mtime(self):
        if self.original and self.stat['mtime'] is None:
            self.stat['mtime'] = get_sourcefile_modification_time(self)
        return self.stat['mtime']

    @mtime.setter
    def mtime(self, timestamp):
        self.stat['mtime'] = timestamp

    @property
    def imagehash(self):
        """Calculate or retrieve imagehash value."""
        if not self._imagehash and self.original:
            try:
                self.imagehash = get_imagehash(self.large)
            except (IOError, FileNotFoundError):
                self.imagehash = get_imagehash(self.original)
        try:
            return imagehash.hex_to_hash(self._imagehash)
        except ValueError:
            # could not calculate imagehash
            return imagehash.hex_to_hash('F' * 16)

    @imagehash.setter
    def imagehash(self, value):
        self._imagehash = str(value) if value else ''

    def calculate_hashes(self):
        """Make sure the image has size, mtime, md5 and imagehash"""
        fields = ['stat', '_imagehash', 'modified']
        if all([
            self.stat.get('mtime'),
            self.stat.get('md5'),
            self.stat.get('size'),
            self._imagehash,
        ]):
            return False  # ok
        # calculate values
        updated = (
            self.mtime,
            self.md5,
            self.size,
            self.imagehash,
        )
        assert all(updated), f'All {fields} should have a value'

        if self.pk is not None:
            # save unless instance does not exist already in db.
            self.save(update_fields=['_imagehash', 'stat', 'modified'])
            logger.debug(f'updated hashes and stats {self}')
        return True
