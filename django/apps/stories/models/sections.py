"""Sections and Story Types"""

import logging

from django.db import models
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
from django_extensions.db.fields import AutoSlugField
from slugify import Slugify

slugify = Slugify(max_length=50, to_lower=True)
logger = logging.getLogger(__name__)


def default_section():
    """Default section"""
    s = Section.objects.first() or Section.objects.create(title='default')
    return s.pk


def default_story_type():
    """Default story type"""
    s = StoryType.objects.first() or StoryType.objects.create(name='default')
    return s.pk


class Section(models.Model):
    """ A Section in the publication containing one kind of content. """

    class Meta:
        verbose_name = _('Section')
        verbose_name_plural = _('Sections')

    title = models.CharField(
        unique=True,
        max_length=50,
        help_text=_('Section title'),
        verbose_name=_('section title'),
    )

    slug = AutoSlugField(
        _('slug'),
        populate_from=('title', ),
        default='section-slug',
        max_length=50,
        overwrite=True,
        slugify_function=slugify,
    )

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        url = reverse(
            viewname='section',
            kwargs={
                'section': self.slug,
            },
        )
        return url

    def storytypes(self):
        return self.storytype_set.active()


class StoryTypeQueryset(models.QuerySet):
    def active(self):
        return self.filter(active=True)


class StoryType(models.Model):
    """ A type of story in the publication. """

    objects = StoryTypeQueryset.as_manager()
    name = models.CharField(unique=True, max_length=50)
    section = models.ForeignKey(
        Section,
        default=default_section,
        on_delete=models.SET_DEFAULT,
    )
    prodsys_mappe = models.CharField(blank=True, null=True, max_length=20)

    slug = AutoSlugField(
        _('slug'),
        default='storytype-slug',
        populate_from=['name'],
        max_length=50,
        overwrite=True,
        slugify_function=slugify,
    )
    active = models.BooleanField(
        verbose_name=_('active'),
        help_text=_('is this story type active?'),
        default=True
    )

    class Meta:
        verbose_name = _('StoryType')
        verbose_name_plural = _('StoryTypes')

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        url = reverse(
            viewname='storytype',
            kwargs={
                'storytype': self.slug,
                'section': self.section.slug,
            },
        )
        return url

    def count(self):
        """Number of stories."""
        return self.story_set.count()
