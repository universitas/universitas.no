import logging

from apps.photo.models import ImageFile
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel
from utils.model_mixins import EditURLMixin

logger = logging.getLogger(__name__)


class FrontpageStoryManager(models.Manager):
    def published(self):

        from apps.stories.models import Story
        return super().get_queryset().filter(
            story__publication_status=Story.STATUS_PUBLISHED
        )

    def create_for_story(self, story):
        try:
            main_image = story.main_image().imagefile
        except AttributeError:
            main_image = None

        frontpage_story = FrontpageStory.objects.create(
            story=story,
            headline=story.title[:190],
            vignette='{story.story_type[:40]}',
            html_class=story.section.slug,
            imagefile=main_image,
            priority=story.priority,
        )
        return frontpage_story


class FrontpageStory(TimeStampedModel, EditURLMixin):
    SIZE_CHOICES = [(n, f'{n}') for n in (2, 3, 4, 6)]

    class Meta:
        verbose_name = _('Frontpage Story')
        verbose_name_plural = _('Frontpage Stories')

    objects = FrontpageStoryManager()

    story = models.ForeignKey(
        'stories.Story',
        on_delete=models.CASCADE,
    )
    imagefile = models.ForeignKey(
        ImageFile,
        null=True,
        blank=True,
        help_text=_('image'),
        on_delete=models.CASCADE,
    )
    headline = models.CharField(
        blank=True,
        max_length=200,
        help_text=_('headline'),
    )
    kicker = models.CharField(
        blank=True,
        max_length=200,
        help_text=_('kicker'),
    )
    vignette = models.CharField(
        blank=True,
        max_length=50,
        help_text=_('vignette'),
    )
    lede = models.CharField(
        blank=True,
        max_length=200,
        help_text=_('lede'),
    )
    html_class = models.CharField(
        blank=True,
        max_length=200,
        help_text=_('html_class'),
    )
    columns = models.PositiveSmallIntegerField(
        default=3,
        choices=SIZE_CHOICES,
        verbose_name=_('columns'),
        help_text=_('base width'),
    )
    rows = models.PositiveIntegerField(
        default=2,
        choices=SIZE_CHOICES,
        verbose_name=_('rows'),
        help_text=_('base height'),
    )
    priority = models.FloatField(
        default=0,
        verbose_name=_('priority'),
        help_text=_('Modify ordering.'),
    )
    order = models.PositiveIntegerField(
        default=0,
        editable=False,
        verbose_name=_('order'),
    )
    published = models.BooleanField(
        default=True,
        verbose_name=_('published'),
        help_text=_('published'),
    )

    def save(self, *args, **kwargs):
        try:
            timestamp = self.story.publication_date.timestamp()
        except AttributeError:
            timestamp = timezone.now().timestamp()
        hours_pub = timestamp / 3600
        hours_pri = self.priority * 24
        self.order = int(hours_pub + hours_pri)
        if not self.story.is_published:
            self.published = False
        super().save(*args, **kwargs)

    @property
    def url(self):
        return self.story.get_absolute_url()

    @property
    def story_type_url(self):
        return self.story.story_type.get_absolute_url()

    @property
    def size(self):
        return (self.columns, self.rows)

    @property
    def preview(self):
        if self.imagefile:
            return self.imagefile.preview
        else:
            return None

    def __str__(self):
        return self.headline or self.story.title
