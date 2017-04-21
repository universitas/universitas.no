""" Photography and image files in the publication  """

# Python standard library
import logging
import json
from collections import namedtuple

# Django core
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.validators import MaxValueValidator, MinValueValidator
from django.core.exceptions import ValidationError
from .cropping.boundingbox import Box

# Third party apps
from sorl import thumbnail

logger = logging.getLogger(__name__)

Cropping = namedtuple('Cropping', ['top', 'left', 'diameter'])


class CropBox(Box):

    _attrs = ['left', 'top', 'bottom', 'right', 'x', 'y']

    def __init__(self, left, top, right, bottom, x, y):
        h = [0.0, left, x, right, 1.0]
        v = [0.0, top, y, bottom, 1.0]
        if not (sorted(h), sorted(v)) == (h, v):
            raise ValueError('invalid data %s: %s' % (h, v))
        self.x, self.y = x, y
        super().__init__(left, top, right, bottom)

    def __str__(self):
        return json.dumps(self.serialize())


def parse_box_data(value):
    try:
        data = json.loads(value)
        return CropBox(**data)
    except json.JSONDecodeError:
        return default_crop_box()
    except ValueError:
        return default_crop_box()


def default_crop_box():
    return CropBox(0, 0, 1, 1, 0.5, 0.5)


def validate_box(value):
    try:
        CropBox(**value.__dict__)
    except ValueError as err:
        raise ValidationError(str(err))


class BoxField(models.Field):
    description = 'Bounding Box field'
    default_validators = [validate_box]

    def from_db_value(self, value, expression, connection, context):
        if value is None:
            return value
        return parse_box_data(value)

    def to_python(self, value):
        if isinstance(value, Box):
            return value
        if value is None:
            return value
        return parse_box_data(value)

    def get_prep_value(self, value):
        if value is None:
            return ''
        validate_box(value)
        return json.dumps(value.serialize())

    def get_internal_type(self):
        return 'TextField'


class AutoCropImage(models.Model):
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
        default=default_crop_box,
        help_text=_('How this image has been cropped.'),
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

    @property
    def cropping(self):
        return Cropping(
            top=self.from_top,
            left=self.from_left,
            diameter=self.crop_diameter)

    def save(self, *args, **kwargs):
        cls = self.__class__
        try:
            saved = cls.objects.get(id=self.pk)
        except cls.DoesNotExist:
            pass
        else:
            if all((self.cropping_method != self.CROP_PENDING,
                    saved.cropping_method != self.CROP_PENDING,
                    saved.cropping != self.cropping)):
                self.cropping_method = self.CROP_MANUAL

        super().save(*args, **kwargs)

    def thumb(self, height=315, width=600):
        geometry = '{}x{}'.format(width, height)
        try:
            return thumbnail.get_thumbnail(
                self.source_file,
                geometry,
                crop_box=self.get_crop_box()).url
        except Exception as e:
            msg = 'Thumbnail failed: {} {}'.format(e, self.source_file)
            logger.warn(msg)
            return self.source_file

    def autocrop(self):
        self.cropping_method = self.CROP_PENDING
        self.save()

    def get_crop_box(self):
        return self.crop_box.serialize()
