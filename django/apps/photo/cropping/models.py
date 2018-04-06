""" Photography and image files in the publication  """

import logging

from django.db import models
from django.utils.translation import ugettext_lazy as _
from sorl import thumbnail
from utils.model_fields import BoxField

# from .boundingbox import CropBox

logger = logging.getLogger(__name__)


class AutoCropImage(models.Model):
    """ Advanced cropping """
    CROP_NONE = 0
    CROP_PENDING = 1
    CROP_FEATURES = 5
    CROP_PORTRAIT = 15
    CROP_FACES = 10
    CROP_MANUAL = 100

    CROP_CHOICES = (
        (CROP_NONE, _('center')),
        (CROP_PENDING, _('pending')),
        (CROP_FEATURES, _('corner detection')),
        (CROP_FACES, _('multiple faces')),
        (CROP_PORTRAIT, _('single face')),
        (CROP_MANUAL, _('manual crop')),
    )

    class Meta:
        abstract = True

    cropping_method = models.PositiveSmallIntegerField(
        verbose_name=_('cropping method'),
        choices=CROP_CHOICES,
        default=CROP_PENDING,
        help_text=_('How this image has been cropped.'),
    )
    crop_box = BoxField(
        verbose_name=_('crop box'),
        null=True,
        help_text=_('How this image has been cropped.'),
    )

    def save(self, *args, **kwargs):
        cls = self.__class__
        try:
            saved = cls.objects.get(id=self.pk)
        except cls.DoesNotExist:
            pass
        else:
            if all((
                self.cropping_method != self.CROP_PENDING,
                saved.cropping_method != self.CROP_PENDING,
                saved.crop_box != self.crop_box
            )):
                self.cropping_method = self.CROP_MANUAL

        super().save(*args, **kwargs)

    def thumb(self, height=315, width=600):
        geometry = '{}x{}'.format(width, height)
        try:
            return thumbnail.get_thumbnail(
                self.source_file, geometry, crop_box=self.get_crop_box()
            ).url
        except Exception as e:
            msg = 'Thumbnail failed: {} {}'.format(e, self.source_file)
            logger.warn(msg)
            return self.source_file

    def autocrop(self):
        self.cropping_method = self.CROP_PENDING
        self.save()

    def get_crop_box(self):
        return self.crop_box.serialize()
