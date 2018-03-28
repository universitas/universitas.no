""" Photography and image files in the publication  """

import logging
import os
import re
from pathlib import Path
from typing import Union

from apps.issues.models import current_issue
from django.conf import settings
from django.contrib.postgres.fields import JSONField
from django.core.files import File
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel
from slugify import Slugify
from sorl import thumbnail
from sorl.thumbnail.images import ImageFile as SorlImageFile
from utils.model_mixins import EditURLMixin

from .cropping.models import AutoCropImage
from .exif import ExifData, exif_to_json, extract_exif_data
from .file_operations import get_imagehash, image_from_fingerprint
from .imagehash import ImageHashModelMixin

logger = logging.getLogger(__name__)
PROFILE_IMAGE_UPLOAD_FOLDER = 'byline-photo'

image_file_validator = FileExtensionValidator(['jpg', 'jpeg', 'png'])


class BrokenImage:
    """If thumbnail fails"""
    url = settings.STATIC_URL + 'admin/img/icon-no.svg'

    def read(self):
        return b''


Thumbnail = Union[SorlImageFile, BrokenImage]


def upload_image_to(instance: 'ImageFile', filename: str) -> str:
    """Image folder name based on issue number and year"""
    return os.path.join(instance.upload_folder(), instance.slugify(filename))


class ImageFileQuerySet(models.QuerySet):
    def pending(self):
        return self.filter(cropping_method=self.model.CROP_PENDING)

    def photos(self):
        return self.filter(category=ImageCategoryMixin.PHOTO)

    def profile_images(self):
        return self.filter(category=ImageCategoryMixin.PROFILE)


class ImageFileManager(models.Manager):
    def update_exif(self) -> int:
        """Look for exif metadata in source file and save if found"""
        count = 0
        for image in self.get_queryset():
            if image.exif_data != image.add_exif_from_file():
                count += 1
                image.save()
        return count

    def update_descriptions(self) -> int:
        """Look for image description and add if found"""
        count = 0
        for image in self.get_queryset():
            if image.description != image.add_description():
                count += 1
                image.save()
        return count

    def search(self, md5=None, imagehash=None, fingerprint=None, **kwargs):
        """Search for images matching query."""
        if fingerprint:
            try:
                image = image_from_fingerprint(fingerprint)
            except ValueError as err:
                raise ValueError('incorrect fingerprint: %s' % err) from err
            imagehash = str(get_imagehash(image))
        if imagehash:
            kwargs['_imagehash'] = imagehash
        if md5:
            kwargs['stats__md5'] = md5
        qs = self.get_queryset()
        if kwargs:
            results = qs.filter(**kwargs)
            if results:
                return results
        if imagehash:
            logger.debug('hash: %s' % imagehash)
            return qs.filter(_imagehash__trigram_similar=imagehash)
        return qs.none()


class ImageCategoryMixin(models.Model):
    """Sort images by category"""

    class Meta:
        abstract = True

    UNKNOWN = 0
    PHOTO = 1
    ILLUSTRATION = 2
    DIAGRAM = 3
    PROFILE = 4
    EXTERNAL = 5

    CATEGORY_CHOICES = (
        (UNKNOWN, _('unknown')),
        (PHOTO, _('photo')),
        (ILLUSTRATION, _('illustration')),
        (DIAGRAM, _('diagram')),
        (PROFILE, _('profile image')),
        (EXTERNAL, _('third party image')),
    )

    category = models.PositiveSmallIntegerField(
        verbose_name=_('category'),
        help_text=_('category'),
        choices=CATEGORY_CHOICES,
        default=UNKNOWN,
    )


class ImageFile(  # type: ignore
    ImageHashModelMixin, TimeStampedModel, EditURLMixin, AutoCropImage,
    ImageCategoryMixin
):
    """Photo or Illustration in the publication."""

    objects = ImageFileManager.from_queryset(ImageFileQuerySet)()

    class Meta:
        verbose_name = _('ImageFile')
        verbose_name_plural = _('ImageFiles')

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
        editable=False,
        max_length=1000,
    )
    contributor = models.ForeignKey(
        'contributors.Contributor',
        verbose_name=_('contributor'),
        help_text=_('who made this'),
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
    )
    description = models.CharField(
        verbose_name=_('description'),
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
        editable=False,
    )

    def __str__(self):
        if self.original:
            return os.path.basename(self.original.name)
        else:
            return super(ImageFile, self).__str__()

    def upload_folder(self) -> str:
        if self.is_profile_image():
            return PROFILE_IMAGE_UPLOAD_FOLDER
        try:
            issue = current_issue()
            year, number = issue.year, issue.number
        except Exception:
            year = timezone.now().year
            number = '0'
        return f'{year}/{number}'

    def slugify(self, filename: str) -> str:
        """Normalize file name"""
        slugify = Slugify(safe_chars='.-', separator='-')
        if self.is_profile_image():
            filename = filename.title()
        slugs = slugify(filename).split('.')
        slugs[-1] = slugs[-1].lower().replace('jpeg', 'jpg')
        slug = '.'.join(segment.strip('-') for segment in slugs)
        return slug

    @property
    def artist(self) -> str:
        """Attribution as string"""
        if self.contributor:
            return f'{self.contributor} / Universitas'
        return self.copyright_information or '?'

    @property
    def original(self) -> File:
        return self.source_file

    @property
    def small(self) -> Thumbnail:
        return self.thumbnail('200x200')

    @property
    def large(self) -> Thumbnail:
        return self.thumbnail('1500x1500')

    @property
    def preview(self) -> Thumbnail:
        """Return thumb of cropped image"""
        options = dict(crop_box=self.get_crop_box())
        if self.is_profile_image():
            options.update(expand=0.2, colorspace='GRAY')
        return self.thumbnail('150x150', **options)

    @property
    def exif(self) -> ExifData:
        return extract_exif_data(self.exif_data)

    def similar(self, field='imagehash') -> models.QuerySet:
        """Finds visually simular images using postgresql trigram search."""
        others = ImageFile.objects.exclude(pk=self.pk)
        if field == 'imagehash':
            return others.filter(_imagehash__trigram_similar=self._imagehash)
        if field == 'md5':
            return others.filter(stat__md5=self.stat.md5)
        if field == 'created':
            treshold = timezone.timedelta(minutes=30)
            return others.filter(
                created__gt=self.created - treshold,
                created__lt=self.created + treshold,
            )
        else:
            msg = f'field should be imagehash, md5 or created, not {field}'
            raise ValueError(msg)

    def thumbnail(self, size='x150', **options) -> Thumbnail:
        """Create thumb of image"""
        try:
            return thumbnail.get_thumbnail(self.original, size, **options)
        except Exception:
            logger.exception('Cannot create thumbnail')
            return BrokenImage()

    def download_from_aws(self, dest=Path('/var/media/')) -> None:
        """Download file for development server"""
        path = dest / self.original.name
        if path.exists():
            return
        data = self.original.file.read()
        path.parent.mkdir(0o775, True, True)
        path.write_bytes(data)

    def save_again(self) -> None:
        """fix broken files. THIS IS HACK"""
        src = self.original
        filename = os.path.basename(src.name)
        content = File(src)
        src.save(filename, content)

    def is_profile_image(self) -> bool:
        return self.category == self.PROFILE

    def build_thumbs(self) -> None:
        """Make sure thumbs exists"""
        self.large
        self.small
        self.preview
        logger.info(f'built thumbs {self}')

    def add_description(self) -> str:
        """Populates `description` with relevant content from related models"""
        if not self.description:
            if self.is_profile_image():
                if self.person.count():
                    self.description = self.person.first().display_name
                else:
                    self.description = ''
            else:
                cap_list = self.storyimage_set.values_list(
                    'caption', flat=True
                )
                captions = [re.sub(r'/s+', ' ', c.strip()) for c in cap_list]
                captions = list(set(captions))
                self.description = '\n'.join(captions)[:1000]
        return self.description

    def add_exif_from_file(self) -> dict:
        if self.pk:
            raw = self.small.read()
        else:
            fp = self.original
            if fp.closed:
                fp.open('rb')
            fp.seek(0)
            raw = fp.read()
            fp.seek(0)
        self.exif_data = exif_to_json(raw)
        data = extract_exif_data(self.exif_data)
        if not self.description:
            self.description = data.description
        if not self.copyright_information:
            self.copyright_information = data.copyright
        if data.datetime:
            self.created = data.datetime

        return self.exif_data

    def delete_thumbnails(self, delete_file=False) -> None:
        """Delete all thumbnails, optinally delete original too"""
        thumbnail.delete(self.original, delete_file=delete_file)

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.add_exif_from_file()
        super().save(*args, **kwargs)
