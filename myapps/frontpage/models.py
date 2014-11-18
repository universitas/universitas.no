# Django core
from django.db import models
from model_utils.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _
# from django.core.exceptions import ObjectDesNotExist

# Project apps
# from myapps.stories.models import Story
from myapps.photo.models import ImageFile
import logging
logger = logging.getLogger('universitas')


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
        top_story = self.contentblock_set.order_by('-position').first()
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


class Contentblock(TimeStampedModel):

    """ A single item on the front page """
    ORDER_GAP = 100
    # positions have free space inbetween to
    # make reordering possible without changing many objects in the database.

    def validate_columns(value, minvalue=1, maxvalue=12):
        if not minvalue <= value <= maxvalue:
            raise ValidationError(_('{} is not a number between {} and {}').format(value, minvalue, maxvalue))

    def validate_height(value, minvalue=1, maxvalue=3):
        if not minvalue <= value <= maxvalue:
            raise ValidationError(_('{} is not a number between {} and {}').format(value, minvalue, maxvalue))

    def position_default(self):
        return self.frontpage.top_position() + self.ORDER_GAP

    def save(self):
        if self.position is None:
            self.position = self.position_default()
            self.randomsize()
        super().save()

    def __str__(self):
        return '%s %s %s %s' % (self.frontpage_story.headline, self.columns, self.height, self.position,)

    def randomsize(self):
        widths = (3, 3, 3, 3, 4, 4, 4, 4, 6, 6, 8, 9, 12)
        heights = (1, 1, 1, 1, 1, 2, 2, 2, 2, 3)
        from random import choice
        self.columns = choice(widths)
        self.height = choice(heights)
        self.save()
        # logger.debug(self)

    @property
    def publication_date(self):
        # TODO: Bør være eget felt i databasen og i utgangspunktet settes likt databasen.
        return self.frontpage_story.story.publication_date

    frontpage = models.ForeignKey(
        Frontpage,
        editable=False,
    )

    frontpage_story = models.ForeignKey(
        'FrontpageStory',
        editable=False,
    )

    position = models.PositiveIntegerField(
        help_text=_('larger numbers come first'),
    )

    height = models.PositiveSmallIntegerField(
        help_text=_('height - minimum 1 maximum 3'),
        default=1,
        validators=[validate_height, ],
    )

    columns = models.PositiveSmallIntegerField(
        help_text=_('width - minimum 1 maximum 12'),
        default=6,
        validators=[validate_columns, ],
    )

    class Meta:
        verbose_name = _('Content block')
        verbose_name_plural = _('Content blocks')
        ordering = ['-position']


# class FrontPageBlock(TimeStampedModel):
#     class Meta:
#         verbose_name = _('Frontpage block')
#         verbose_name_plural = _('Frontpage blocks')
#         abstract = True
#         ordering = ['position']


# class AdvertBlock(FrontpageBlock):
#     pass


class FrontpageStory(TimeStampedModel):

    class Meta:
        verbose_name = _('Frontpage Story')
        verbose_name_plural = _('Frontpage Stories')

    story = models.ForeignKey(
        'stories.Story'
    )
    placements = models.ManyToManyField(
        Frontpage,
        through=Contentblock,
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

    def save(self, *args, **kwargs):
        if self.pk is None and self.story:
            # default lede, kicker, headline and kicker is based on parent story.
            self.lede = self.lede or self.story.lede[:200]
            self.kicker = self.kicker or self.story.kicker[:200]
            self.headline = self.headline or self.story.title[:200]
            self.html_class = self.html_class or str(self.story.section)[:200].lower().replace(' ', '-')
            if self.imagefile is None and not self.story.images.count() == 0:
                self.imagefile = self.story.images.first()
            super().save()
        if self.placements.count() == 0 and not self.imagefile is None:
            # is automatically put on front page if it has an image.
            content_block = Contentblock(
                frontpage_story=self,
                frontpage=Frontpage.objects.root(),
            )
            content_block.save()
        super().save()

    def __str__(self):
        return self.headline or self.story.title
