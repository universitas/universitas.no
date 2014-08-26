# -*- coding: utf-8 -*-
"""
Admin for frontpage app.
"""

from django.contrib import admin
from .models import Contentblock, FrontpageStory
import autocomplete_light

class FrontpageStoryInline(admin.TabularInline):
    form = autocomplete_light.modelform_factory(FrontpageStory)
    model = FrontpageStory
    fields = ('headline', 'kicker', 'lede', 'image',),
    extra = 0

@admin.register(Contentblock)
class ContentblockAdmin(admin.ModelAdmin):

    save_on_top = True
    list_per_page = 25
    list_display = (
        'id',
        'frontpage_story',
        'publication_date',
        # 'created',
        'position',
        'columns',
        'frontpage',
    )

    list_editable = (
        'position',
        'columns',
    )
    # inlines = (
    #     FrontpageStoryInline,
    # )