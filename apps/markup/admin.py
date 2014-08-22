# -*- coding: utf-8 -*-
"""
Admin for markup app.
"""

from django.contrib import admin
from . import models


# class BylineInline(admin.TabularInline):
#     model = models.Byline
#     extra = 0

@admin.register(models.ProdsysTag)
class ProdsysTagAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'xtag',
        'html_tag',
        'html_class',
    )

    list_editable = (
        'xtag',
        'html_tag',
        'html_class',
    )
