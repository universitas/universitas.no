# -*- coding: utf-8 -*-
""" Content in the publication. """

# Python standard library
import re
# import html

# Django core
from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.core.cache import cache

# Installed apps

# Project apps


class CachedTag(models.Model):

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        type(self).objects.delete_cache()
        super().save(*args, **kwargs)


class MarkupTag(CachedTag):

    class Meta:
        abstract = True

    start_tag = models.CharField(
        default='',
        unique=True,
        blank=True,
        max_length=50,
    )
    html_tag = models.CharField(
        default='p',
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

    def get_html_class(self):
        if self.html_class:
            return ' class="{}"'.format(self.html_class)
        else:
            return ''


class TagManager(models.Manager):
    cache_key = 'tags'

    def cache_query(self):
        return self.extra(select={
            'taglength': 'Length(start_tag)'
        }).order_by('-taglength')

    def cached(self):
        memo = cache.get(self.cache_key)
        if not memo:
            memo = list(self.cache_query())
            cache.set(self.cache_key, memo, 600)
        return memo

    def delete_cache(self):
        cache.delete(self.cache_key)


class BlockTagManager(TagManager):
    cache_key = 'blocktags'

    def match(self, content):
        """ return first block tag used in content """
        for tag in self.cached():
            if tag.match(content):
                return tag

    def make_html(self, content):
        """ convert tagged text to html """
        for tag in self.cached():
            if tag.match(content):
                return tag.make_html(content)
        else:
            return content

    def strip_tags(self, content):
        """ strips all markup tags from content """
        for tag in self.cached():
            content = tag.split(content)[1]
        return content

    def match_or_create(self, content):
        tag = self.match(content)
        xtag_pattern = r'^@[^: ]+:'
        if tag.start_tag == '' and re.search(xtag_pattern, content):
            match = re.search(xtag_pattern, content).group()
            tag = self.create(start_tag=match)
        return tag


class BlockTag(MarkupTag):

    objects = BlockTagManager()

    class Meta:
        verbose_name = _('block tag')
        verbose_name_plural = _('block tags')
    # TODO: Should maybe not be hard coded, but imported from apps.stories.Story
    ACTION_CHOICES = (
        ('append:', _('add'),),
        ('append:bodytext', _('body text'),),
        ('append:title', _('title'),),
        ('append:kicker', _('kicker'),),
        ('append:lede', _('lede'),),
        ('append:theme_word', _('theme word'),),
        ('new:byline', _('byline'),),
        ('new:aside', _('create aside'),),
        ('new:pullquote', _('create pullquote'),),
        ('drop:', _('delete'),),
    )

    action = models.CharField(
        # used to populate model fields in Story on import.
        choices=ACTION_CHOICES,
        default=ACTION_CHOICES[0][0],
        max_length=200,
    )

    def match(self, content):
        """ Returns true if tag matches content """
        return content.startswith(self.start_tag)

    def split(self, content):
        """ Removes tag from tagged content string """
        if self.match(content):
            content = content.replace(self.start_tag, '', 1).strip()
        return self.start_tag, content

    def make_html(self, content):
        if self.match(content):
            html_block = '<{tag}{class_parameter}>{content}</{tag}>'.format(
                tag=self.html_tag,
                class_parameter=self.get_html_class(),
                content=self.split(content)[1],
            )
            return html_block
        else:
            return content


class InlineTagManager(BlockTagManager):
    cache_key = 'inlinetags'

    def make_html(self, content):
        for tag in self.cached():
            content = tag.make_html(content)
        return content


class InlineTag(MarkupTag):

    objects = InlineTagManager()

    class Meta:
        verbose_name = _('inline tag')
        verbose_name_plural = _('inline tags')

    end_tag = models.CharField(
        max_length=50,
    )

    pattern = models.CharField(
        blank=True,
        default='',
        max_length=200,
    )

    replacement = models.CharField(
        blank=True,
        default='',
        max_length=200,
    )

    def make_pattern(self):
        return r'{start_tag}(.+?){end_tag}'.format(
            start_tag=self.start_tag,
            end_tag=self.end_tag,
        )

    def make_replacement(self):
        return '<{tag}{class_parameter}>{content}</{tag}>'.format(
            tag=self.html_tag,
            class_parameter=self.get_html_class(),
            content=r'\1',
        )

    def match(self, content):
        """ Returns true if tag matches content """
        match = re.search(self.pattern, content)
        return bool(match)

    def strip_tag(self, content):
        """ Removes tag from tagged content string """
        content = re.sub(self.pattern, r'\1', content)
        return content

    def make_html(self, content):
        return re.sub(self.pattern, self.replacement, content)

    def save(self, *args, **kwargs):
        if not self.end_tag:
            self.end_tag = self.start_tag
        if self.pk:
            saved_self = type(self).objects.get(pk=self.pk)
            if (saved_self.start_tag, saved_self.end_tag) != (self.start_tag, self.end_tag):
                self.pattern = None
            if (saved_self.html_tag, saved_self.html_class) != (self.html_tag, self.html_class):
                self.replacement = None
        if not self.pattern:
            self.pattern = self.make_pattern()
        if not self.replacement:
            self.replacement = self.make_replacement()
        super().save(*args, **kwargs)


class AliasManager(TagManager):
    cache_key = 'aliases'

    def cache_query(self):
        return self.order_by('ordering')

    def replace(self, content, timing=1, ):
        for tag in self.cached():
            if tag.timing == timing:
                content = tag.replace(content)
        return content


class Alias(CachedTag):

    TIMING_CHOICES = (
        (1, _('import'),),
        (2, _('extra'),),
        (3, _('bylines'),),
        (4, _('template'),),
    )

    class Meta:
        ordering = ('ordering',)
        verbose_name = _('Alias')
        verbose_name_plural = _('Aliases')

    objects = AliasManager()

    pattern = models.CharField(
        max_length=100,
    )
    replacement = models.CharField(
        blank=True,
        max_length=100,
    )
    flags = models.CharField(
        blank=True,
        max_length=5,
        default='ILM'
    )
    flags_sum = models.PositiveSmallIntegerField(
        editable=False,
    )
    timing = models.PositiveSmallIntegerField(
        default=TIMING_CHOICES[0][0],
        choices=TIMING_CHOICES,
    )
    ordering = models.PositiveSmallIntegerField(
        default=1,
    )
    comment = models.TextField(
        default=_('explain this pattern')
    )

    def calculate_flags(self):
        flags_sum = 0
        flags = ''
        for letter in set(self.flags.upper()):
            if hasattr(re, letter):
                flags_sum += getattr(re, letter)
                flags += letter
        self.flags = flags
        self.flags_sum = flags_sum

    def save(self, *args, **kwargs):
        self.calculate_flags()
        super().save(*args, **kwargs)

    def replace(self, content):
        return re.sub(self.pattern, self.replacement, content, flags=self.flags_sum)
