# -*- coding: utf-8 -*-
"""
Admin for stories app.
"""

from django.contrib import admin
from . import models
from apps.photo.models import ImageFile
from sorl.thumbnail.admin import AdminImageMixin


class BylineInline(admin.TabularInline):
    model = models.Byline
    fields = (
        'story',
        'credit',
        'contributor',
        'title',
    )
    readonly_fields = (
        'story',
        'contributor',
        )
    extra = 0


class AsideInline(admin.TabularInline):
    model = models.Aside
    extra = 0


class PullquoteInline(admin.TabularInline):
    model = models.Pullquote
    extra = 0


class ImageInline(AdminImageMixin, admin.TabularInline):
    model = models.StoryImage
    fields = (
        'published',
        'position',
        'caption',
        'creditline',
        'size',
        'imagefile',
        'source_image',
    )
    readonly_fields = (
        'source_image',
    )
    # model = ImageFile
    extra = 0


class StoryTypeInline(admin.TabularInline):
    model = models.StoryType
    extra = 1


@admin.register(models.Story)
class StoryAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'title',
        'kicker',
        'lede',
        'theme_word',
        'story_type',
        'publication_date',
        'status',
        # 'issue',
    )

    list_editable = (
        # 'title',
        # 'kicker',
        # 'lede',
        'theme_word',
        'story_type',
        # 'publication_date',
        'status',
        # 'issue',
    )

    inlines = [
        ImageInline,
        BylineInline,
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


@admin.register(models.Section)
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


@admin.register(models.StoryType)
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


@admin.register(models.Byline)
class BylineAdmin(admin.ModelAdmin):
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
