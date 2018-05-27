""" Admin for frontpage app.  """

from apps.photo.admin import ThumbAdmin
from django.contrib import admin

from .models import FrontpageStory


@admin.register(FrontpageStory)
class FrontpageStoryAdmin(admin.ModelAdmin, ThumbAdmin):
    save_on_top = True
    list_per_page = 15
    list_display = [
        'id',
        'columns',
        'rows',
        'headline',
        'lede',
        'kicker',
        'cropped_thumb',
        'priority',
        'order',
        'published',
    ]
    ordering = ['-order']
    readonly_fields = ['cropped_thumb']
    autocomplete_fields = ['story', 'imagefile']
    list_editable = [
        'priority', 'kicker', 'headline', 'columns', 'rows', 'published'
    ]
    search_fields = ['headline']
