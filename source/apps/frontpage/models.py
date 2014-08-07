# Django core
from django.db import models
from model_utils.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _

# Project apps
from apps.stories.models import Story
from apps.photo.models import Image


class Frontpage(TimeStampedModel):

    label = models.CharField(
        unique=True,
        help_text=_('Unique label used in url'),
        max_length=100,
        )

    published = models.BooleanField(
        help_text=_('This page is published.'),
        default=False)

    draft_of = models.ForeignKey(
        'Frontpage',
        help_text=_('Is a draft version of other Frontpage.'),
        editable=False,
        blank=True,
        null=True,
        )

    class Meta:
        verbose_name = _('Frontpage')
        verbose_name_plural = _('Frontpages')

    def __unicode__(self):
       return self.label


class FrontpageStory(TimeStampedModel):
    class Meta:
        verbose_name = _('FrontpageStory')
        verbose_name_plural = _('FrontpageStorys')

    story = models.ForeignKey(Story)

    image = models.ForeignKey(Image)

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

    def __unicode__(self):
        return '%s %s'%(self.headline, self.modified)
