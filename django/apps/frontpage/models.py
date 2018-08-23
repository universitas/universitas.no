import logging

from apps.photo.models import ImageFile
from django.db import models
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel
from utils.model_mixins import EditURLMixin

logger = logging.getLogger(__name__)


def frontpagestry_size(story):
    """initialise size of frontpage story"""
    priority = story.priority
    if priority < 6:
        return (2, 2, 0)
    if priority < 8:
        return (2, 4, 0)
    if priority < 10:
        return (4, 4, 1)
    return (6, 4, 2)


class FrontpageStoryManager(models.Manager):
    """Manager for FrontpageStory"""

    def published(self):
        from apps.stories.models import Story
        return self.get_queryset().filter(
            published=True,
            story__publication_status__in=[
                Story.STATUS_PUBLISHED, Story.STATUS_NOINDEX
            ]
        )

    def create_for_story(self, story):
        """factory function"""

        exists = story.frontpagestory_set.first()
        if exists:
            return exists

        columns, rows, priority = frontpagestry_size(story)

        try:
            main_image = story.main_image().imagefile
        except AttributeError:
            main_image = None
            rows -= 1

        frontpage_story = FrontpageStory.objects.create(
            columns=columns,
            rows=rows,
            priority=priority,
            story=story,
            headline=story.title[:190],
            vignette=str(story.story_type)[:40],
            html_class=story.section.slug,
            imagefile=main_image,
            published=True,
        )
        frontpage_story.save()
        return frontpage_story


class FrontpageStory(TimeStampedModel, EditURLMixin):
    COL_CHOICES = [(n, f'{n}') for n in (2, 3, 4, 6)]
    ROW_CHOICES = [(n, f'{n}') for n in (1, 2, 3, 4, 5, 6)]

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
        choices=COL_CHOICES,
        verbose_name=_('columns'),
        help_text=_('base width'),
    )
    rows = models.PositiveIntegerField(
        default=2,
        choices=ROW_CHOICES,
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
        self.order = self.calculate_order()
        super().save(*args, **kwargs)

    def calculate_order(self):
        """Recalculate ordering on frontpage"""
        try:
            timestamp = self.story.publication_date.timestamp()
        except AttributeError:
            # parent story is not published
            return 0
        else:
            return int((timestamp / 3600) + (self.priority * 24))

    def __str__(self):
        return self.headline or self.story.title

    @property
    def size(self):
        return (self.columns, self.rows)

    @property
    def url(self):
        return self.story.get_absolute_url()

    @property
    def story_type_url(self):
        return self.story.story_type.get_absolute_url()

    @property
    def preview(self):
        if self.imagefile:
            return self.imagefile.preview
        else:
            return None

    @property
    def small(self):
        if self.imagefile:
            return self.imagefile.small
        else:
            return None
