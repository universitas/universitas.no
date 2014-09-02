# -*- coding: utf-8 -*-
""" Content in the publication. """

# Python standard library
import re
import html

# Django core
from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.core.cache import cache

# Installed apps

# Project apps

class TagManager(models.Manager):

    def list(self):
        memo = cache.get('blocktags')
        if not memo:
            memo = list(self.all())
            cache.set('blocktags', memo, 600)
        return memo


class MarkupTag(models.Model):

    class Meta:
        abstract = True

    start_tag = models.CharField(
        default='',
        unique=True,
        max_length=50,
        )
    html_tag = models.CharField(
        default='',
        max_length=50
        )
    html_class = models.CharField(
        default='',
        blank=True,
        max_length=50,
        )

    def __str__(self):
        """ unicode  """
        return self.start_tag

    def save(self, *args, **kwargs):
        if not self.pk and not self.html_class:
            self.html_class = self.start_tag
        super().save(*args, **kwargs)

class BlockTag(MarkupTag):

    objects = TagManager()

    class Meta:
        verbose_name = _('block tag')
        verbose_name_plural = _('block tags')
    # TODO: Should maybe not be hard coded, but imported from apps.stories.Story
    ACTION_CHOICES = (
        ('add_to:', _('add'),),
        ('add_to:bodytext', _('body text'),),
        ('add_to:title', _('title'),),
        ('add_to:kicker', _('kicker'),),
        ('add_to:lede', _('lede'),),
        ('add_to:theme_word', _('theme word'),),
        ('new:byline', _('byline'),),
        ('new:aside', _('aside'),),
        ('new:pullquote', _('pullquote'),),
        ('drop:', _('delete'),),
        )

    action = models.CharField(
        # used to populate model fields in Story on import.
        choices=ACTION_CHOICES,
        default=ACTION_CHOICES[0][0],
        max_length=200,
        )

    def wrap(self, content):
        """ Wrap string in html for this tag """
        content = html.escape(content)
        if self.html_class is None:
            block = '<%s>%s</%s>' % (self.html_tag, content, self.html_tag)
        else:
            block = '<%s class="%s">%s</%s>' % (self.html_tag, self.html_class, content, self.html_tag)
        return block

    @classmethod
    def wrap_text(cls, xtag, content):
        """ Wrap text in html tags even if tag does not exist yet. """
        # TODO: Prodsystag.wrap_text() bør gjøres i en utilityfunksjon som ikke misbruker databasen så mye.

        tag = cls.objects.get_or_create(start_tag=xtag)[0]
        return tag.wrap(content)

