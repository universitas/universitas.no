# -*- coding: utf-8 -*-
"""
Admin for markup app.
"""

from django.contrib import admin
from . import models


@admin.register(models.BlockTag)
class BlockTagAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'start_tag',
        'action',
        'html_tag',
        'html_class',
    )

    list_editable = (
        'start_tag',
        'action',
        'html_tag',
        'html_class',
    )


@admin.register(models.InlineTag)
class InlineTagAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'start_tag',
        'end_tag',
        'pattern',
        'replacement',
        'html_tag',
        'html_class',
    )

    list_editable = (
        'start_tag',
        'end_tag',
        'html_tag',
        'html_class',
    )

@admin.register(models.Alias)
class AliasAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'pattern',
        'replacement',
        'flags',
        'timing',
        'ordering',
        'comment',
    )

    list_editable = (
        'pattern',
        'replacement',
        'flags',
        'timing',
        'ordering',
    )
