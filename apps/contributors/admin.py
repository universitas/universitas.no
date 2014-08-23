# -*- coding: utf-8 -*-
"""
Admin for contributors app.
"""

from django.contrib import admin
from . import models
from apps.stories.admin import BylineInline

@admin.register(models.Contributor)
class ContributorAdmin(admin.ModelAdmin):
    list_display = (
        'display_name',
        'bylines_count',
        'initials',
        )
    list_editable = (
        'display_name',
        )
    search_fields = (
        'display_name',
        )

    inlines = [
    BylineInline,

    ]