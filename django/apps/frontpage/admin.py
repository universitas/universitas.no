""" Admin for frontpage app.  """

from apps.photo.admin import ThumbAdmin
from django.contrib import admin

from .models import FrontpageStory, StaticModule, StoryModule


class StoryModuleInline(admin.TabularInline):
    model = StoryModule
    fields = [
        'position',
        'columns',
        'height',
    ]
    extra = 0


@admin.register(FrontpageStory)
class FrontpageStoryAdmin(admin.ModelAdmin, ThumbAdmin):
    save_on_top = True
    list_per_page = 25
    list_display = [
        'id',
        'kicker',
        'headline',
        'lede',
        'story',
        'cropped_thumb',
    ]
    readonly_fields = [
        'cropped_thumb',
    ]
    autocomplete_fields = [
        'story',
        'imagefile',
    ]
    list_editable = [
        'headline',
    ]
    inlines = [
        StoryModuleInline,
    ]
    search_fields = [
        'headline',
        'kicker',
    ]


@admin.register(StoryModule)
class StoryModuleAdmin(admin.ModelAdmin):
    save_on_top = True
    list_per_page = 25
    list_display = [
        'id',
        'frontpage_story',
        'publication_date',
        'position',
        'columns',
        'height',
        'frontpage',
    ]
    list_editable = [
        'position',
        'columns',
        'height',
    ]


@admin.register(StaticModule)
class StaticModuleAdmin(admin.ModelAdmin):
    save_on_top = True
    list_per_page = 25
    list_display = [
        'id',
        'position',
        'columns',
        'height',
        'content',
        'frontpage',
    ]
    list_editable = [
        'position',
        'columns',
        'height',
    ]
