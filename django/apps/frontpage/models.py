import logging

from django.db import models
from django.db.models import F
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel

from apps.photo.models import ImageFile
from utils.model_mixins import EditURLMixin

logger = logging.getLogger(__name__)


class Days(models.Func):
    """Cast float field to Interval in days"""
    output_field = models.DurationField()
    template = "to_char(%(expressions)s, 'S9990.0999 \"days\"')::interval"


class Epoch(models.Func):
    """Get epoch timestamp from date time field """
    output_field = models.FloatField()
    template = "extract(epoch from %(expressions)s) / (60 * 60 * 24)"


class FrontpageQuerySet(models.QuerySet):
    def published(self):
        from apps.stories.models import Story
        return self.filter(
            published=True,
            story__publication_status__in=[
                Story.STATUS_PUBLISHED, Story.STATUS_NOINDEX
            ]
        )

    def with_ranking(self):
        return self.annotate(
            baserank=Epoch('story__publication_date'),
            ranking=F('baserank') + F('priority'),
        ).order_by(F('ranking').desc(nulls_last=True))


def frontpagestory_size(story):
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

    def create_for_story(self, story):
        """factory function"""

        exists = story.frontpagestory_set.first()
        if exists:
            return exists

        columns, rows, priority = frontpagestory_size(story)

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

    objects = FrontpageStoryManager.from_queryset(FrontpageQuerySet)()

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
    published = models.BooleanField(
        default=True,
        verbose_name=_('published'),
        help_text=_('published'),
    )

    def __str__(self):
        return self.headline or self.story.title

    @property
    def publication_date(self):
        dawn_of_time = timezone.make_aware(timezone.datetime(2000, 1, 1))
        return self.story.publication_date or dawn_of_time

    @property
    def size(self):
        return (self.columns, self.rows)

    @size.setter
    def size(self, value):
        self.columns, self.rows = value

    @property
    def crop_box(self):
        return self.imagefile.crop_box if self.imagefile else None

    @crop_box.setter
    def crop_box(self, value):
        self.imagefile.crop_box = value
        self.imagefile.clean()
        self.imagefile.save()

    @property
    def story_url(self):
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
