# -*- coding: utf-8 -*-
"""
Admin for stories app.
"""

from django.contrib import admin
from . import models


class BylineInline(admin.TabularInline):
    model = models.Byline
    extra = 0


class AsideInline(admin.TabularInline):
    model = models.Aside
    extra = 0


class PullquoteInline(admin.TabularInline):
    model = models.Pullquote
    extra = 0

class ImageInline(admin.TabularInline):
    model = models.StoryImage
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
        'issue',
    )

    list_editable = (
        'title',
        'kicker',
        # 'lede',
        'theme_word',
        'story_type',
        # 'publication_date',
        'status',
        # 'issue',
    )

    inlines = [
        BylineInline,
        PullquoteInline,
        AsideInline,
        ImageInline,
    ]


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
        'template',
        'prodsys_mappe',
    )
