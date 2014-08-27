# -*- coding: utf-8 -*-
"""
Admin for stories app.
"""

from django.contrib import admin
from .models import Byline, Aside, Pullquote, Story, StoryType, Section, StoryImage
# from myapps.photo.models import ImageFile
# from sorl.thumbnail.admin import AdminImageMixin
from myapps.frontpage.models import FrontpageStory
import autocomplete_light


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


class ImageInline(admin.TabularInline):
    form = autocomplete_light.modelform_factory(StoryImage)
    model = StoryImage
    fields = (
        'published',
        'position',
        'caption',
        'creditline',
        'size',
        'imagefile',
    )
    raw_id_fields = (
        # 'imagefile',
    )
    extra = 0


class StoryTypeInline(admin.TabularInline):
    model = StoryType
    # inlines [ContentblockInline]
    extra = 1


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):

    save_on_top = True

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
    fields = (
        ('title', 'kicker', 'theme_word',),
        ('story_type', 'publication_date', 'status',),
        ('lede', 'bodytext_markup',),
    )

    inlines = [
        BylineInline,
        FrontpageStoryInline,
        ImageInline,
        PullquoteInline,
        AsideInline,
    ]

    search_fields = (
        'title',
        'lede',
        'theme_word',
        # 'story_type__name',
        # 'bylines',
    )


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
