""" Photography and image files in the publication  """

import logging
import os
import re
from pathlib import Path

from model_utils.models import TimeStampedModel
from slugify import Slugify
from sorl import thumbnail

from apps.issues.models import current_issue
from django.conf import settings
from django.contrib.postgres.fields import JSONField
from django.core.files import File
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from utils.model_mixins import EditURLMixin

from .cropping.models import AutoCropImage
from .exif import exif_to_json, extract_exif_data
from .imagehash import ImageHashModelMixin

logger = logging.getLogger(__name__)

image_file_validator = FileExtensionValidator(['jpg', 'jpeg', 'png'])


class BrokenImage:
    """If thumbnail fails"""
    url = settings.STATIC_URL + 'admin/img/icon-no.svg'

    def read(self):
        return b''


def upload_image_to(instance, filename):
    """Image folder name based on issue number and year"""
    return os.path.join(instance.upload_folder(), instance.slugify(filename))


class ImageFileQuerySet(models.QuerySet):
    def pending(self):
        return self.filter(cropping_method=self.model.CROP_PENDING)

    def photos(self):
        return self.exclude(source_file__startswith=ProfileImage.UPLOAD_FOLDER)

    def profile_images(self):
        return self.filter(source_file__startswith=ProfileImage.UPLOAD_FOLDER)

    def update_exif(self):
        """Look for exif metadata in source file and save if found"""
        count = 0
        for image in self:
            if image.exif_data != image.add_exif_from_file():
                count += 1
                image.save()
        return count

    def update_descriptions(self):
        """Look for image description and add if found"""
        count = 0
        for image in self:
            if image.description != image.add_description():
                count += 1
                image.save()
        return count


class ImageFileManager(models.Manager):
    def create_from_file(self, filepath, **kwargs):
        image = self.model(**kwargs)
        image.save_local_image_as_source(filepath)
        return image


class ImageFile(  # type: ignore
    ImageHashModelMixin, TimeStampedModel, EditURLMixin, AutoCropImage
):
    """Photo or Illustration in the publication."""

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
        null=True,
        editable=False,
    )
    full_width = models.PositiveIntegerField(
        verbose_name=_('width'),
        help_text=_('full height in pixels'),
        null=True,
        editable=False,
    )
    old_file_path = models.CharField(
        verbose_name=_('old file path'),
        help_text=_('previous path if the image has been moved.'),
        blank=True,
        null=True,
        max_length=1000,
    )
    contributor = models.ForeignKey(
        'contributors.Contributor',
        verbose_name=_('contributor'),
        help_text=_('who made this'),
        blank=True,
        null=True,
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
            'extra information about license and attribution if needed.'
        ),
        blank=True,
        null=True,
        max_length=1000,
    )
    exif_data = JSONField(
        verbose_name=_('exif_data'),
        help_text=_('exif_data'),
        default=dict,
    )

    def __str__(self):
        if self.original:
            return os.path.basename(self.original.name)
        else:
            return super(ImageFile, self).__str__()

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

    @property
    def exif(self):
        return extract_exif_data(self.exif_data)

    def similar(self, field='imagehash'):
        """Finds visually simular images using postgresql trigram search."""
        others = ImageFile.objects.exclude(pk=self.pk)
        if field == 'imagehash':
            return others.filter(_imagehash__trigram_similar=self._imagehash)
        if field == 'md5':
            return others.filter(_md5=self._md5)
        if field == 'created':
            treshold = timezone.timedelta(minutes=30)
            return others.filter(
                created__gt=self.created - treshold,
                created__lt=self.created + treshold,
            )
        else:
            msg = f'field should be imagehash, md5 or created, not {field}'
            raise ValueError(msg)

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

    def add_description(self):
        """Populates `description` with relevant content from related models"""
        if not self.description and self.is_profile_image():
            return ProfileImage.add_description(self)

        if not self.description:
            cap_list = self.storyimage_set.values_list('caption', flat=True)
            captions = [re.sub(r'/s+', ' ', c.strip()) for c in cap_list]
            captions = list(set(captions))
            self.description = '\n'.join(captions)[:1000]
        return self.description

    def add_exif_from_file(self):
        if self.pk:
            raw = self.small.read()
        else:
            self.original.open()
            raw = self.original.read()
            self.original.close()
        self.exif_data = exif_to_json(raw)
        data = extract_exif_data(self.exif_data)
        if not self.description:
            self.description = data.description
        if not self.copyright_information:
            self.copyright_information = data.copyright
        if data.datetime:
            self.created = data.datetime

        return self.exif_data

    def delete_thumbnails(self, delete_file=False):
        """Delete all thumbnails, optinally delete original too"""
        thumbnail.delete(self.original, delete_file=delete_file)

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.add_exif_from_file()
        super().save(*args, **kwargs)


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
