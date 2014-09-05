# -*- coding: utf-8 -*-
"""
Admin for stories app.
"""

from django.contrib import admin
from .models import Byline, Aside, Pullquote, Story, StoryType, Section, StoryImage, InlineLink, StoryVideo
# from django.utils.html import format_html_join
from django.utils.safestring import mark_safe
# from myapps.photo.models import ImageFile
# from sorl.thumbnail.admin import AdminImageMixin
from myapps.frontpage.models import FrontpageStory
import autocomplete_light
from myapps.photo.admin import ThumbAdmin


class BylineInline(admin.TabularInline):
    form = autocomplete_light.modelform_factory(Byline)
    model = Byline
    fields = (
        'story',
        'credit',
        'contributor',
        'title',
    )
    raw_id_fields = (
        # 'story',
        # 'contributor',
        )
    extra = 0


class FrontpageStoryInline(admin.TabularInline):
    form = autocomplete_light.modelform_factory(FrontpageStory)
    model = FrontpageStory
    fields = ('headline', 'kicker', 'lede', 'image',),
    extra = 0


class AsideInline(admin.TabularInline):
    model = Aside
    extra = 0


class PullquoteInline(admin.TabularInline):
    model = Pullquote
    extra = 0


class LinkInline(admin.TabularInline):
    form = autocomplete_light.modelform_factory(Story)
    model = InlineLink
    fk_name = 'parent_story'
    extra = 0


class VideoInline(admin.TabularInline):
    model = StoryVideo
    fields = (
        'published',
        'position',
        'caption',
        'creditline',
        'size',
        'vimeo_id',
    )
    extra = 0


class ImageInline(admin.TabularInline, ThumbAdmin):
    form = autocomplete_light.modelform_factory(StoryImage)
    model = StoryImage
    fields = (
        'published',
        'position',
        'caption',
        'creditline',
        'size',
        'imagefile',
        'thumbnail',
    )
    readonly_fields = (
        'thumbnail',
    )
    # def thumbnail(self, instance, width=200, height=100):
    #     from sorl.thumbnail import get_thumbnail
    #     url = '/static/admin/img/icon-no.gif'
    #     if hasattr(instance, 'imagefile'):
    #         imagefile = instance.imagefile
    #     else:
    #         imagefile = instance
    #     if imagefile:
    #         source = imagefile.source_file
    #         thumb = get_thumbnail(source, '%sx%s' % (width, height))
    #         url = thumb.url
    #     return mark_safe('<img src="{}">'.format(url))

    # thumbnail.allow_tags = True
    extra = 0


class StoryTypeInline(admin.TabularInline):
    model = StoryType
    # inlines [ContentblockInline]
    extra = 1


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    date_hierarchy = 'publication_date'
    actions_on_top = True
    actions_on_bottom = True
    save_on_top = True
    list_per_page = 25
    list_display = (
        'id',
        'title',
        'kicker',
        'lede',
        'theme_word',
        'story_type',
        'publication_date',
        'status',
        'display_bylines',
        'image_count',
        'hit_count',
        # 'issue',
    )

    list_editable = (
        # 'title',
        # 'kicker',
        # 'lede',
        # 'theme_word',
        # 'story_type',
        # 'publication_date',
        'status',
        # 'issue',
    )

    readonly_fields = ('legacy_html_source', 'legacy_prodsys_source',)

    fieldsets = (
        (None, {
            'fields': (
                ('title', 'kicker', 'theme_word',),
                ('story_type', 'publication_date', 'status',),
                ('lede', 'bodytext_markup',),
            )
        }),
        ('source', {
            'classes': ('collapse',),
            'fields': (
                ('legacy_html_source', 'legacy_prodsys_source', ),
            )
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
    form = autocomplete_light.modelform_factory(Byline)
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
