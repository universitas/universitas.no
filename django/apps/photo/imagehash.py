import hashlib
import logging
import os
from io import BytesIO

import boto
import imagehash
import PIL

from django.core.files import File
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

logger = logging.getLogger(__name__)


def local_file_md5(filepath, blocksize=65536):
    """Hexadecimal md5 hash of a file stored on local disk"""
    hasher = hashlib.md5()
    with open(filepath, 'rb') as source:
        buf = source.read(blocksize)
        while len(buf) > 0:
            hasher.update(buf)
            buf = source.read(blocksize)
    return hasher.hexdigest()


def calculate_image_hash(fp, size=11):
    """Calculate perceptual hash for comparison of identical images"""
    try:
        blob = BytesIO(fp.read())
        img = PIL.Image.open(blob).convert('L').resize((size, size))
        return imagehash.dhash(img)
    except Exception as e:
        logger.exception('failed')
        return ''


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
        if self.pk is None:
            self.md5
            self.size
            self.imagehash

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
        self._md5 = value if value else None

    @property
    def imagehash(self):
        """Calculate or retrieve imagehash value"""
        if not self._imagehash and self.original:
            self.imagehash = calculate_image_hash(self.large)
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
