import logging

from django.conf import settings
from django.db import models
from sorl import thumbnail
from sorl.thumbnail.helpers import ThumbnailError

logger = logging.getLogger(__name__)
IMGSIZES = [200, 800, 1500]


class BrokenImage:
    """If thumbnail fails."""
    url = settings.STATIC_URL + 'admin/img/icon-no.svg'

    def read(self):
        return b''


class ThumbImageFile(models.Model):
    class Meta:
        abstract = True

    @property
    def small(self):
        return self.thumbnail('{0}x{0}'.format(*IMGSIZES))

    @property
    def medium(self):
        return self.thumbnail('{1}x{1}'.format(*IMGSIZES), upscale=False)

    @property
    def large(self):
        return self.thumbnail('{2}x{2}'.format(*IMGSIZES), upscale=False)

    @property
    def preview(self):
        """Return thumb of cropped image"""
        options = dict(crop_box=self.get_crop_box())
        if self.category == self.DIAGRAM:
            options.update(expand=1)
        if self.category == self.PROFILE:
            options.update(expand=0.2, colorspace='GRAY')
        return self.thumbnail('150x150', **options)

    def thumbnail(self, size='x150', **options):
        """Create thumb of image"""
        if not self.original:
            return BrokenImage()
        try:
            return thumbnail.get_thumbnail(self.original, size, **options)
        except Exception:
            logger.exception(f'Cannot create thumbnail for {self}')
            return BrokenImage()

    def build_thumbs(self):
        """Make sure thumbs exists"""
        if not self.original:
            return
        self.large
        self.small
        self.preview
        logger.info(f'built thumbs {self}')

    def delete_thumbnails(self, delete_file=False):
        """Delete all thumbnails, optinally delete original too"""
        try:
            thumbnail.delete(self.original, delete_file=delete_file)
        except ThumbnailError:
            return
