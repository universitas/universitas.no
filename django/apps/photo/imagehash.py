import logging
from pathlib import Path

import boto
import imagehash
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from utils.model_fields import AttrJSONField

from .file_operations import get_imagehashes, get_md5

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
        help_text=_('perceptual hash of image using ahash algorithm'),
        max_length=16,
        editable=False,
        default='',
    )
    stat = AttrJSONField(
        verbose_name=_('stat'),
        help_text=_('file stats'),
        editable=False,
        default=dict,
    )
    HASH_TYPES = 'ahash', 'dhash', 'phash', 'whash'

    def save(self, *args, **kwargs):
        self.calculate_hashes(save=False)
        super().save(*args, **kwargs)

    @property
    def filesize(self):
        return self.stat.size

    @property
    def imagehashes(self):
        """Calculate or retrieve imagehash values."""
        try:
            return {
                key: imagehash.hex_to_hash(self.stat[key])
                for key in self.HASH_TYPES
            }
        except KeyError as err:
            logger.debug(f'keyerror: {err}')
            hashes = (
                get_imagehashes(self.small) or get_imagehashes(self.original)
            )
            self.imagehashes = hashes
            return hashes
        except ValueError:
            # could not calculate imagehash
            return imagehash.hex_to_hash('F' * 16)

    @imagehashes.setter
    def imagehashes(self, hashes):
        for key in self.HASH_TYPES:
            self.stat[key] = str(hashes[key])
        self._imagehash = self.stat.ahash

    def calculate_hashes(self, save=True):
        """Make sure the image has size, mtime, md5 and imagehash"""
        values = []
        if self.original:
            if not self.stat.mtime:
                self.stat.mtime = get_sourcefile_modification_time(self)
                values.append(self.stat.mtime)
            if not self.stat.md5:
                self.stat.md5 = get_md5(self.original)
                values.append(self.stat.md5)
            if not self.stat.size:
                self.stat.size = self.original.size
                values.append(self.stat.size)
            if not self._imagehash:
                values.append(self.imagehashes)  # use property getter method

        if not values:
            return False  # ok

        if self.pk is not None and save:
            # save unless instance does not exist already in db.
            self.save(update_fields=['_imagehash', 'stat', 'modified'])
            logger.debug(f'updated hashes and stats {self}')
        return True  # values were updated
