""" Admin for frontpage app.  """

from apps.photo.admin import ThumbAdmin
from django.contrib import admin

from .models import FrontpageStory, StaticModule, StoryModule


class StoryModuleInline(admin.TabularInline):
    model = StoryModule
    fields = (
        'position',
        'columns',
        'height',
    ),
    extra = 0


@admin.register(FrontpageStory)
class FrontpageStoryAdmin(admin.ModelAdmin, ThumbAdmin):
    # form = modelform_factory(FrontpageStory, exclude=())
    # form.Meta.widgets = {
    #     'lede': admin.widgets.AdminTextareaWidget(attrs={'rows': 3})
    # }
    save_on_top = True
    list_per_page = 25
    list_display = (
        'id',
        'kicker',
        'headline',
        'lede',
        'story',
        'cropped_thumb',
        # 'placements',
    )
    readonly_fields = ['cropped_thumb']

    list_editable = (
        'headline',
        # 'kicker',
        # 'lede',
    )
    inlines = (StoryModuleInline, )
    search_fields = (
        'headline',
        'kicker',
    )


@admin.register(StoryModule)
class StoryModuleAdmin(admin.ModelAdmin):
    save_on_top = True
    list_per_page = 25
    list_display = (
        'id',
        'frontpage_story',
        'publication_date',
        'position',
        'columns',
        'height',
        'frontpage',
    )

    list_editable = (
        'position',
        'columns',
        'height',
    )


@admin.register(StaticModule)
class StaticModuleAdmin(admin.ModelAdmin):
    save_on_top = True
    list_per_page = 25
    list_display = (
        'id',
        'position',
        'columns',
        'height',
        'content',
        'frontpage',
    )

    list_editable = (
        'position',
        'columns',
        'height',
    )
