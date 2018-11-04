""" Photography and image files in the publication  """

import logging
import mimetypes
import re
from pathlib import Path
from statistics import median

from apps.contributors.models import Contributor
from apps.photo import file_operations
from django.contrib.postgres.fields import JSONField
from django.contrib.postgres.search import TrigramSimilarity
from django.core.files.storage import default_storage
from django.core.validators import FileExtensionValidator
from django.db import connection, models
from django.db.models.expressions import RawSQL
# from apps.issues.models import current_issue
from django.dispatch import receiver
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel
from slugify import Slugify
from sorl.thumbnail import ImageField
from utils.merge_model_objects import merge_instances
from utils.model_mixins import EditURLMixin

from .cropping.models import AutoCropImage
# from .exif import ExifData, extract_exif_data
from .imagehash import ImageHashModelMixin
from .preprocess import ProcessImage
from .thumbimage import ThumbImageFile

logger = logging.getLogger(__name__)

image_file_validator = FileExtensionValidator(['jpg', 'jpeg', 'png'])


def slugify_filename(filename: str) -> Path:
    """make filename url safe and normalized"""
    slugify = Slugify(safe_chars='.-', separator='-')
    fn = Path(filename)
    stem = Path(filename).stem.split('.')[0]
    stem = re.sub(r'-+', '-', slugify(re.sub(r'_.{7}$', '', stem))).strip('-')
    suffix = ''.join(s.lower().replace('jpeg', 'jpg') for s in fn.suffixes)
    return Path(f'{stem}{suffix}')


def upload_image_to(instance: 'ImageFile', filename: str = 'image') -> str:
    """Upload path based on created date and normalized file name"""
    if instance.pk and instance.stem:
        filename = instance.filename  # autogenerate
    return str(instance.upload_folder() / slugify_filename(filename))


class ImageFileQuerySet(models.QuerySet):
    def pending(self):
        """Awaiting automatic crop calculation"""
        return self.filter(cropping_method=self.model.CROP_PENDING)

    def unused(self):
        """Not used for anything"""
        return self.filter(storyimage=None, person=None, frontpagestory=None)

    def photos(self):
        return self.filter(category=ImageCategoryMixin.PHOTO)

    def illustrations(self):
        return self.filter(category=ImageCategoryMixin.ILLUSTRATION)

    def diagrams(self):
        return self.filter(category=ImageCategoryMixin.DIAGRAM)

    def externals(self):
        return self.filter(category=ImageCategoryMixin.EXTERNAL)

    def profile_images(self):
        return self.filter(category=ImageCategoryMixin.PROFILE)

    def uncategorised(self):
        """Does not have a valid category"""
        return self.filter(category=ImageCategoryMixin.UNKNOWN)

    def with_bigness(self):
        """Calculate crop box bigness"""
        sql = (
            "((crop_box->>'bottom')::float-(crop_box->>'top')::float)"
            "*((crop_box->>'right')::float-(crop_box->>'left')::float)"
        )
        return self.annotate(bigness=RawSQL(sql, []))


def _filter_dupes(dupes, master_hashes, limit=3):
    """Second imagehash comparison pass."""
    diff_pk = []
    for dupe in dupes:
        diffs = [
            val - master_hashes[key] for key, val in dupe.imagehashes.items()
        ]
        diff = median(sorted(diffs)[:3])
        if diff < 8:
            diff_pk.append((diff, dupe.pk))
    if not diff_pk:
        return []
    diff_pk.sort()
    best = diff_pk[0][0] + 0.1
    return [pk for diff, pk in diff_pk if diff / best < 1.5][:limit]


def _get_dupes_raw(qs, ahash, limit=30):
    """Use raw sql to query. This is the only way to use the GIN index."""
    table = ImageFile._meta.db_table
    field = '_imagehash'
    sql = f"""
    SELECT * FROM {table} WHERE {field} %% %(query)s
    ORDER BY similarity({field}, %(query)s ) DESC LIMIT {limit}
    """
    params = {'query': str(ahash)}
    return qs.raw(sql, params)


def _create_gin_index(field='_imagehash', delete=False):
    """Create search index for imagehash."""
    table = ImageFile._meta.db_table
    if delete:
        sql = f'DROP INDEX IF EXISTS {field}_trigram_index;'
    else:
        sql = f'''CREATE INDEX IF NOT EXISTS {field}_trigram_index
                  ON {table} USING GIN ({field} gin_trgm_ops);'''
    with connection.cursor() as cursor:
        cursor.execute(sql)


class ImageFileManager(models.Manager):
    def search(
        self,
        md5=None,
        fingerprint=None,
        filename=None,
        cutoff=0.5,
    ):
        """Search for images matching query."""
        qs = self.get_queryset()
        if md5:
            results = qs.filter(stat__md5=md5)
            if results.count():
                return results
        if fingerprint:
            try:
                master = file_operations.image_from_fingerprint(fingerprint)
            except ValueError as err:
                raise ValueError('incorrect fingerprint: %s' % err) from err
            master_hashes = file_operations.get_imagehashes(master)
            dupes = _get_dupes_raw(qs, master_hashes['ahash'], 30)
            pks = _filter_dupes(dupes, master_hashes)
            return qs.filter(pk__in=pks)

        if filename:
            trigram = TrigramSimilarity('stem', Path(filename).stem)
            return qs.annotate(
                similarity=trigram,
            ).filter(
                similarity__gt=cutoff,
            ).order_by('-similarity')
        return qs.none()

    def filename_search(self, file_name, similarity=0.5):
        """Fuzzy filename search"""
        SQL = '''
        WITH filematches AS (
          SELECT id, SIMILARITY(regexp_replace(original, '.*/', ''), %s)
          AS similarity
          FROM photo_imagefile
        )
        SELECT id from filematches
        WHERE (similarity > %s)
        ORDER BY similarity DESC
        '''
        raw_query = ImageFile.objects.raw(SQL, [file_name, similarity])
        return self.get_queryset().filter(id__in=(im.id for im in raw_query))


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

    @property
    def api_category(self):
        """simplified string category for rest api."""
        mapping = {
            self.EXTERNAL: 'photo',
            self.PHOTO: 'photo',
            self.UNKNOWN: 'photo',
            self.PROFILE: 'profile',
            self.DIAGRAM: 'diagram',
            self.ILLUSTRATION: 'illustration',
        }
        return mapping.get(self.category)


class ImageFile(  # type: ignore
    ProcessImage, ThumbImageFile, ImageHashModelMixin, TimeStampedModel,
    EditURLMixin, AutoCropImage, ImageCategoryMixin,
):
    """Photo or Illustration in the publication."""

    objects = ImageFileManager.from_queryset(ImageFileQuerySet)()

    class Meta:
        verbose_name = _('ImageFile')
        verbose_name_plural = _('ImageFiles')

    stem = models.CharField(
        verbose_name=_('file name stem'),
        max_length=1024,
        blank=True,
    )
    original = ImageField(
        verbose_name=_('original'),
        validators=[image_file_validator],
        upload_to=upload_image_to,
        height_field='full_height',
        width_field='full_width',
        max_length=1024,
        null=True,  # we need pk before we save the image
    )
    full_height = models.PositiveIntegerField(
        verbose_name=_('height'),
        help_text=_('full height in pixels'),
        default=0,
        editable=False,
    )
    full_width = models.PositiveIntegerField(
        verbose_name=_('width'),
        help_text=_('full height in pixels'),
        default=0,
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
        Contributor,
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
        return self.filename or super(ImageFile, self).__str__()

    def upload_folder(self) -> Path:
        """Folder name for images based on creation year/month/date """
        created = self.created or timezone.now()
        return Path(f'{created.year:04}/{created.month:02}/{created.day:02}')

    @property
    def artist(self) -> str:
        """Attribution as string"""
        if self.contributor:
            return f'{self.contributor}'
        return self.copyright_information or '?'

    @property
    def dimensions(self):
        """Pixel dimensions of image file (width x height)"""
        return self.full_width, self.full_height

    @dimensions.setter
    def dimensions(self, value):
        self.full_width, self.full_height = value

    @property
    def suffix(self) -> str:
        """Image file suffix"""
        ext = '.jpg'
        if self.stat.mimetype:
            ext = mimetypes.guess_extension(
                self.stat.mimetype,
                strict=False,
            ) or ext
        elif self.original:
            ext = Path(self.original.name).suffix
        return ext.lower().replace('jpe', 'jpg')

    @property
    def filename(self) -> str:
        """Build a normalized filename"""
        return f'{self.stem}.{(self.pk or 0):0>5}{self.suffix}'

    @property
    def is_profile_image(self) -> bool:
        return self.category == ImageFile.PROFILE

    @property
    def is_photo(self) -> bool:
        return self.category not in [ImageFile.DIAGRAM, ImageFile.ILLUSTRATION]

    def find_similar(self, field='imagehash', minutes=30) -> models.QuerySet:
        """Finds visually simular images using postgresql trigram search."""
        others = ImageFile.objects.exclude(pk=self.pk)
        if field == 'imagehash':
            return others.filter(_imagehash__trigram_similar=self._imagehash)
        if field == 'md5':
            return others.filter(stat__md5=self.stat.md5)
        if field == 'created':
            treshold = timezone.timedelta(minutes=minutes)
            return others.filter(
                created__gt=self.created - treshold,
                created__lt=self.created + treshold,
            )
        else:
            msg = f'field should be imagehash, md5 or created, not {field}'
            raise ValueError(msg)

    def merge_with(self, others):
        """Merge self with duplicate images."""
        # TODO: is `save` needed here?
        merge_instances(self, *list(others)).save()

    def rename_file(self, filename=None, delete_old=False):
        """Rename original"""
        self.delete_thumbnails()
        old_path = self.original.name
        if filename:
            self.stem = slugify_filename(filename).stem
        fp = default_storage.open(old_path)
        self.original.save(self.filename, fp, save=False)
        if delete_old:
            default_storage.delete(old_path)

    def save(self, *args, **kwargs):
        self.stem = slugify_filename(self.stem or self.original.name).stem
        if not self.stat.mimetype and self.original:
            self.stat.mimetype = mimetypes.guess_type(self.original.name)[0]

        if ImageFile.objects.exclude(stem=self.stem).filter(id=self.id):
            self.rename_file()
        super().save(*args, **kwargs)


def async_image_upload(file):
    pass


@receiver(models.signals.post_save, sender=ImageFile)
def update_related_models_modified(sender, instance, raw, **kwargs):
    """cache buster"""
    # we only care if crop_box or category was changed
    nochange = sender.objects.filter(
        pk=instance.pk,
        category=instance.category,
        crop_box=instance.crop_box,
    )
    if raw or nochange or not instance.original:
        # only update related models if cropping is modified
        return

    from apps.stories.models import Story
    # stories
    Story.objects.filter(images__imagefile=instance
                         ).update(modified=instance.modified)
    # story images
    instance.storyimage_set.update(modified=instance.modified)
    # profile images
    instance.person.update(modified=instance.modified)
