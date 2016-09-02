# -*- coding: utf-8 -*-
"""
Admin for stories app.
"""

from django.utils.translation import ugettext_lazy as _
from django.contrib import admin
from django.db import models
from django.forms import Textarea, TextInput
from django.utils.safestring import mark_safe
# from django.utils.html import format_html_join
# from apps.photo.models import ImageFile
# from sorl.thumbnail.admin import AdminImageMixin

from autocomplete_light.forms import modelform_factory

from apps.photo.admin import ThumbAdmin
from apps.frontpage.models import FrontpageStory

from .models import (
    Byline,
    Aside,
    Pullquote,
    Story,
    StoryType,
    Section,
    StoryImage,
    InlineLink,
    StoryVideo,
    InlineHtml)


class SmallTextArea:
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 5, 'cols': 30})},
        models.CharField: {'widget': Textarea(attrs={'rows': 5, 'cols': 30})},
    }


class BylineInline(admin.TabularInline):
    form = modelform_factory(Byline, exclude=())
    model = Byline
    fields = ('ordering', 'credit', 'contributor', 'title', )
    extra = 0
    max_num = 20
    formfield_overrides = {
        models.CharField: {
            'widget': TextInput(
                attrs={
                    'style': 'width:400px;'})},
    }


class FrontpageStoryInline(SmallTextArea, admin.TabularInline, ThumbAdmin):
    form = modelform_factory(FrontpageStory, exclude=())
    model = FrontpageStory
    fields = ('headline', 'kicker', 'lede', 'imagefile', 'thumbnail',),
    readonly_fields = ('thumbnail', )
    extra = 0


class AsideInline(admin.TabularInline, ):
    model = Aside
    formfield_overrides = {
        models.TextField: {
            'widget': Textarea(
                attrs={
                    'rows': 6,
                    'cols': 80})},
    }
    extra = 0


class HtmlInline(admin.TabularInline, ):
    model = InlineHtml
    formfield_overrides = {
        models.TextField: {
            'widget': Textarea(
                attrs={
                    'rows': 6,
                    'cols': 80})},
    }
    extra = 0


class PullquoteInline(admin.TabularInline, ):
    model = Pullquote
    formfield_overrides = {
        models.TextField: {
            'widget': Textarea(
                attrs={
                    'rows': 2,
                    'cols': 80})},
    }
    extra = 0


class LinkInline(admin.TabularInline):
    form = modelform_factory(InlineLink, exclude=())
    model = InlineLink
    fk_name = 'parent_story'
    extra = 0


class VideoInline(admin.TabularInline, ):
    model = StoryVideo
    formfield_overrides = {
        models.CharField: {
            'widget': Textarea(
                attrs={
                    'rows': 5,
                    'cols': 30})},
    }
    fields = [
        'top',
        'index',
        'caption',
        'creditline',
        'size',
        'video_host',
        'host_video_id',
    ]
    extra = 0


class ImageInline(admin.TabularInline, ThumbAdmin, ):
    form = modelform_factory(StoryImage, exclude=())
    formfield_overrides = {
        models.CharField: {
            'widget': Textarea(
                attrs={
                    'rows': 5,
                    'cols': 30})},
    }
    model = StoryImage
    fields = [
        'top',
        'index',
        'caption',
        'creditline',
        'size',
        'aspect_ratio',
        'imagefile',
        'thumbnail',
    ]
    readonly_fields = ('thumbnail', )
    extra = 0


class StoryTypeInline(admin.TabularInline):
    model = StoryType
    extra = 1


def make_frontpage_story(modeladmin, request, queryset):
    make_frontpage_story.short_description = _('make frontpage story')
    for story in queryset:
        FrontpageStory.objects.autocreate(story=story)


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    actions = [make_frontpage_story, ]
    date_hierarchy = 'publication_date'
    actions_on_top = True
    actions_on_bottom = True
    save_on_top = True
    list_per_page = 25
    list_filter = ['language', 'publication_status']
    list_display = [
        'id', 'modified', 'title', 'kicker', 'lede',
        # 'theme_word',
        'hot_count', 'hit_count', 'language',
        'story_type', 'publication_date', 'publication_status',
        # 'display_bylines', 'image_count'
    ]

    list_editable = [
        # 'publication_status',
    ]

    readonly_fields = [
        'legacy_html_source',
        'legacy_prodsys_source',
        'get_html'
        ]

    formfield_overrides = {
        models.CharField: {'widget': Textarea(attrs={'rows': 2, 'cols': 30})},
        models.TextField: {'widget': Textarea(attrs={'rows': 20, 'cols': 60})},
    }

    fieldsets = (
        ('header', {
            'fields': (
                ('title', 'kicker', 'theme_word', 'language', ),
                ('story_type', 'publication_date', 'publication_status',),
            ),
        }),
        ('content', {
            'classes': ('collapsible',),
            'fields': (('lede', 'bodytext_markup',), ),
        }),
        ('preview', {
            'classes': ('collapse',),
            'fields': (('get_html'), ),
        }),
        ('source', {
            'classes': ('collapse',),
            'fields': (('legacy_html_source', 'legacy_prodsys_source', ), ),
        }),
    )

    inlines = [
        BylineInline,
        FrontpageStoryInline,
        ImageInline,
        VideoInline,
        PullquoteInline,
        AsideInline,
        LinkInline,
        HtmlInline,
    ]

    search_fields = (
        'title',
        'lede',
        'bylines_html',
        # 'story_type__name',
        # 'bylines',
    )

    def display_bylines(self, instance):
        return mark_safe(instance.bylines_html) or " -- "

    display_bylines.short_description = 'Bylines'
    display_bylines.allow_tags = True


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'title',
    )

    list_editable = (
        'title',
    )

    inlines = (
        StoryTypeInline,
    )


@admin.register(StoryType)
class StoryTypeAdmin(admin.ModelAdmin):
    form = modelform_factory(StoryType, exclude=[])
    list_display = (
        'id',
        'name',
        'section',
        'template',
        'prodsys_mappe',
    )

    list_editable = (
        'name',
        'section',
        # 'prodsys_mappe',
    )

    raw_id_fields = (
        # 'template',
    )


@admin.register(Byline)
class BylineAdmin(admin.ModelAdmin):
    form = modelform_factory(Byline, exclude=())
    list_display = (
        'id',
        'story',
        'contributor',
        'credit',
        'title',
    )
    list_editable = (
        'credit',
        'title',
    )

    raw_id_fields = (
        # 'story',
        # 'contributor',
    )


def find_linked_story(modeladmin, request, queryset):
    find_linked_story.short_description = _('find linked stories')
    for link in queryset:
        if link.find_linked_story():
            link.save()


def check_link_status(modeladmin, request, queryset):
    find_linked_story.short_description = _('find linked stories')
    for link in queryset:
        link.check_link(save_if_changed=True)


@admin.register(InlineLink)
class LinkAdmin(admin.ModelAdmin):
    form = modelform_factory(InlineLink, exclude=())
    actions_on_bottom = actions_on_top = True
    actions = [find_linked_story, check_link_status]
    list_display = (
        'id',
        'parent_story',
        'number',
        'alt_text',
        'get_html',
        'get_tag',
        'link',
        # 'linked_story',
        'status_code',
    )
    list_editable = (
        'alt_text',
        # 'href',
    )
    list_filter = ('status_code',)
