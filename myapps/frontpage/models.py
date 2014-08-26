# Django core
from django.db import models
from model_utils.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _
# from django.core.exceptions import ObjectDesNotExist

# Project apps
# from myapps.stories.models import Story
from myapps.photo.models import ImageFile


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
        top_story = self.contentblock_set.last()
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

    # @staticmethod
    def validate_columns(value, minvalue=1, maxvalue=12):
        if not minvalue <= value <= maxvalue:
            raise ValidationError(_('{} is not a number between {} and {}').format(value, minvalue, maxvalue))

    def position_default(self):
        return self.frontpage.top_position() + self.ORDER_GAP

    def save(self):
        if self.position is None:
            self.position = self.position_default()
        super().save()

    @property
    def publication_date(self):
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
        help_text=_('position and size of story element.'),
        through=Contentblock,
    )
    image = models.ForeignKey(
        ImageFile,
        null=True, blank=True,
        help_text=_('image'),
    )

    headline = models.CharField(
        help_text=_('headline'),
        blank=True,
        max_length=200)

    kicker = models.CharField(
        help_text=_('kicker'),
        blank=True,
        max_length=200)

    lede = models.CharField(
        help_text=_('lede'),
        blank=True,
        max_length=200)

    html_class = models.CharField(
        help_text=_('html_class'),
        blank=True,
        max_length=200)

    @property
    def url(self):
        return self.story.get_absolute_url()

    def save(self, *args, **kwargs):
        if self.pk is None and self.story:
            self.lede = self.lede or self.story.lede[:200]
            self.kicker = self.kicker or self.story.kicker[:200]
            self.headline = self.headline or self.story.title[:200]
            self.html_class = self.html_class or str(self.story.section)[:200].lower().replace(' ', '-')
            if self.image is None and not self.story.images.count() == 0:
                self.image = self.story.images.first()
        super().save(*args, **kwargs)
        if self.placements.count() == 0:
            content_block = Contentblock(
                frontpage_story=self,
                frontpage=Frontpage.objects.root(),
            )
            content_block.save()

    def __str__(self):
        return self.headline or self.story.title
        # frontpage = self.placements.first()
        # if frontpage:
        #     return '%s %s' % (self.headline, frontpage)
        # else:
        #     return '%s %s' % (self.headline, 'ikke publisert')
