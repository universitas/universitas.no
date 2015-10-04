# -*- coding: utf-8 -*-
# Django core
from django.db import models
import random
from model_utils.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _
# from django.core.exceptions import ObjectDesNotExist

# Project apps
from utils.model_mixins import Edit_url_mixin
from apps.photo.models import ImageFile
import logging
logger = logging.getLogger(__name__)


class FrontpageManager(models.Manager):

    def root(self):
        return super().get_queryset().first()

    def published(self):
        return super().get_queryset().filter(published=True)


class Frontpage(TimeStampedModel):

    objects = FrontpageManager()

    label = models.CharField(
        unique=True,
        help_text=_('Unique label used in url'),
        max_length=100,
        blank=True,
    )

    published = models.BooleanField(
        help_text=_('This page is published.'),
        default=False)

    # draft_of = models.ForeignKey(
    #     'Frontpage',
    #     help_text=_('Is a draft version of other Frontpage.'),
    #     editable=False,
    #     blank=True,
    #     null=True,
    # )

    def __str__(self):
        return self.label

    def top_position(self):
        top_story = self.storymodule_set.order_by('-position').first()
        if top_story is None:
            return 0
        else:
            return top_story.position

    class Meta:
        verbose_name = _('Frontpage')
        verbose_name_plural = _('Frontpages')

    def __unicode__(self):
        return self.label

from django.core.exceptions import ValidationError


class FrontPageModule(TimeStampedModel, Edit_url_mixin):

    """ A single item on the front page """

    class Meta:
        abstract = True

    def validate_columns(value, minvalue=1, maxvalue=12):
        if not minvalue <= value <= maxvalue:
            raise ValidationError(
                _('{} is not a number between {} and {}').format(
                    value,
                    minvalue,
                    maxvalue))

    def validate_height(value, minvalue=1, maxvalue=12):
        if not minvalue <= value <= maxvalue:
            raise ValidationError(
                _('{} is not a number between {} and {}').format(
                    value,
                    minvalue,
                    maxvalue))

    frontpage = models.ForeignKey(
        Frontpage,
        default=1,
        editable=True,
    )

    height = models.PositiveSmallIntegerField(
        help_text=_('height - minimum 1 maximum 12'),
        default=2,
        validators=[validate_height, ],
    )

    columns = models.PositiveSmallIntegerField(
        help_text=_('width - minimum 1 maximum 12'),
        default=6,
        validators=[validate_columns, ],
    )


class StoryModule(FrontPageModule):

    """ Frontpage Story placement module """

    ORDER_GAP = 100
    # positions have free space inbetween to
    # make reordering possible without changing many objects in the database.

    class Meta:
        verbose_name = _('Story module')
        verbose_name_plural = _('Story module')
        ordering = ['-position']

    frontpage_story = models.ForeignKey(
        'FrontpageStory',
        editable=False,
    )

    position = models.PositiveIntegerField(
        help_text=_('larger numbers come first'),
    )

    def save(self):
        if not self.position:
            self.position = self.position_default()
        super().save()

    def __str__(self):
        return '{headline} {columns} {height} {position}'.format(
            headline=self.frontpage_story.headline,
            columns=self.columns,
            height=self.height,
            position=self.position,
        )

    def position_default(self):
        return self.frontpage.top_position() + self.ORDER_GAP

    @property
    def publication_date(self):
        # TODO: Frontpagestory publication date eget felt i modellen, i stedet
        # for å hentes fra related story.
        return self.frontpage_story.story.publication_date


class StaticModule(FrontPageModule):

    """ Block with static placement containing special content """

    class Meta:
        verbose_name = _('Static module')
        verbose_name_plural = _('Static modules')
        ordering = ['position']

    name = models.CharField(max_length=50)
    content = models.TextField()

    position = models.IntegerField(
        help_text=_('Placement on front page'),
    )

    render_template = models.BooleanField(
        help_text=_('Use django template rendering'),
        default=False)

    def save(self, *args, **kwargs):
        if '{%' in self.content or '{{' in self.content:
            self.render_template = True
        super().save(*args, **kwargs)


class FrontpageStoryManager(models.Manager):
    SIZES = [(3, 1), (3, 1), (3, 1), (3, 2),
             (3, 1), (3, 2), (3, 2), (4, 1),
             (4, 2), (4, 2), (6, 1), (6, 2),
             (9, 2), (9, 2), (12, 1), (12, 2), ]

    def published(self):

        from apps.stories.models import Story
        return super().get_queryset().filter(
            story__publication_status=Story.STATUS_PUBLISHED
        )

    def autocreate(self, story):
        frontpage = Frontpage.objects.root()
        html_class = story.section.slug + \
            random.choice([' negative'] + [''] * 4)
        lede = (story.lede or story.get_plaintext().strip())[:190]
        kicker = story.kicker[:190]
        headline = story.title[:190]
        vignette = str(story.story_type)[:40]

        try:
            main_image = story.main_image().imagefile
        except AttributeError:
            main_image = None

        frontpage_story = FrontpageStory(
            story=story,
            headline=headline,
            lede=lede,
            kicker=kicker,
            vignette=vignette,
            html_class=html_class,
            imagefile=main_image,
        )

        frontpage_story.save()

        priority = story.priority
        size = self.SIZES[priority + random.randint(0, 3)]
        msg = 'p:{} size:{}'.format(priority, size)
        logger.debug(msg)

        columns = size[0]
        height = size[1] + bool(main_image)

        content_block = StoryModule(
            frontpage_story=frontpage_story,
            frontpage=frontpage,
            columns=columns,
            height=height,
        )
        content_block.save()


class FrontpageStory(TimeStampedModel, Edit_url_mixin):

    class Meta:
        verbose_name = _('Frontpage Story')
        verbose_name_plural = _('Frontpage Stories')

    objects = FrontpageStoryManager()

    story = models.ForeignKey(
        'stories.Story'
    )
    placements = models.ManyToManyField(
        Frontpage,
        through=StoryModule,
        help_text=_('position and size of story element.'),
    )
    imagefile = models.ForeignKey(
        ImageFile,
        null=True, blank=True,
        help_text=_('image'),
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

    @property
    def url(self):
        return self.story.get_absolute_url()

    @property
    def story_type_url(self):
        return self.story.story_type.get_absolute_url()

    # def save(self, *args, **kwargs):
    #     if self.pk is None and self.story:
    # default lede, kicker, headline and kicker is based on parent
    # story.
    #         section = '{}'.format(self.story.section).lower()
    #         self.lede = self.lede or self.story.lede[:200]
    #         self.kicker = self.kicker or self.story.kicker[:200]
    #         self.headline = self.headline or self.story.title[:200]
    #         self.vignette = self.vignette or section[:50]
    #         self.html_class = self.html_class or section[:200].replace(' ', '-')
    #         if random.randint(1, 4) == 1:
    #             self.html_class += " negative"

    #         if self.imagefile is None and self.story.images():
    #             self.imagefile = self.story.main_image().imagefile

    #         super().save()
    #     if self.placements.count() == 0 and not self.imagefile is None:
    # is automatically put on front page if it has an image.
    #         content_block = StoryModule(
    #             frontpage_story=self,
    #             frontpage=Frontpage.objects.root(),
    #         )
    #         content_block.save()
    #     super().save()

    def __str__(self):
        return self.headline or self.story.title
