# -*- coding: utf-8 -*-
"""
Admin for stories app.
"""

from django.utils.translation import ugettext_lazy as _
from django.contrib import admin
from .models import Byline, Aside, Pullquote, Story, StoryType, Section, StoryImage, InlineLink, StoryVideo
# from django.utils.html import format_html_join
from django.utils.safestring import mark_safe
# from myapps.photo.models import ImageFile
# from sorl.thumbnail.admin import AdminImageMixin
from myapps.frontpage.models import FrontpageStory
import autocomplete_light
from myapps.photo.admin import ThumbAdmin
from django.db import models
from django.forms import Textarea, TextInput


class SmallTextArea:
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 5, 'cols': 30})},
        models.CharField: {'widget': Textarea(attrs={'rows': 5, 'cols': 30})},
    }


class BylineInline(admin.TabularInline):
    form = autocomplete_light.modelform_factory(Byline, exclude=())
    model = Byline
    fields = ('story', 'credit', 'contributor', 'title', )
    extra = 0
    formfield_overrides = {models.CharField: {'widget': TextInput(attrs={'style': 'width:400px;'})}, }


class FrontpageStoryInline(SmallTextArea, admin.TabularInline, ThumbAdmin):
    form = autocomplete_light.modelform_factory(FrontpageStory, exclude=())
    model = FrontpageStory
    fields = ('headline', 'kicker', 'lede', 'imagefile', 'thumbnail',),
    readonly_fields = ('thumbnail', )
    extra = 0


class AsideInline(admin.TabularInline, ):
    model = Aside
    formfield_overrides = {models.TextField: {'widget': Textarea(attrs={'rows': 6, 'cols': 80})}, }
    extra = 0


class PullquoteInline(admin.TabularInline, ):
    model = Pullquote
    formfield_overrides = {models.TextField: {'widget': Textarea(attrs={'rows': 2, 'cols': 80})}, }
    extra = 0


class LinkInline(admin.TabularInline):
    form = autocomplete_light.modelform_factory(InlineLink, exclude=())
    model = InlineLink
    fk_name = 'parent_story'
    extra = 0


class VideoInline(admin.TabularInline, ):
    model = StoryVideo
    formfield_overrides = {models.CharField: {'widget': Textarea(attrs={'rows': 5, 'cols': 30})}, }
    fields = ('published', 'position', 'caption', 'creditline', 'size', 'video_host', 'host_video_id', )
    extra = 0


class ImageInline(admin.TabularInline, ThumbAdmin, ):
    form = autocomplete_light.modelform_factory(StoryImage, exclude=())
    formfield_overrides = {models.CharField: {'widget': Textarea(attrs={'rows': 5, 'cols': 30})}, }
    model = StoryImage
    fields = ('published', 'position', 'caption', 'creditline', 'size', 'imagefile', 'thumbnail', )
    readonly_fields = ('thumbnail', )
    extra = 0


class StoryTypeInline(admin.TabularInline):
    model = StoryType
    extra = 1


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    date_hierarchy = 'publication_date'
    actions_on_top = True
    actions_on_bottom = True
    save_on_top = True
    list_per_page = 25
    list_display = (
        'id', 'title', 'kicker', 'lede', 'theme_word', 'story_type', 'publication_date',
        'status', 'display_bylines', 'image_count', 'hit_count',
    )

    list_editable = (
        'status',
    )

    readonly_fields = ('legacy_html_source', 'legacy_prodsys_source', 'get_html')

    formfield_overrides = {
        models.CharField: {'widget': Textarea(attrs={'rows': 2, 'cols': 30})},
        models.TextField: {'widget': Textarea(attrs={'rows': 20, 'cols': 60})},
    }

    fieldsets = (
        ('header', {
            'fields': (
                ('title', 'kicker', 'theme_word',),
                ('story_type', 'publication_date', 'status',),
            ),
        }),
        ('content', {
            'classes': ('collapse',),
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


@admin.register(Byline)
class BylineAdmin(admin.ModelAdmin):
    form = autocomplete_light.modelform_factory(Byline, exclude=())
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
    form = autocomplete_light.modelform_factory(Byline, exclude=())
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
