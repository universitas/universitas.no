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
        # 'end_tag',
        'action',
        'html_tag',
        'html_class',
    )

    list_editable = (
        'start_tag',
        # 'end_tag',
        'action',
        'html_tag',
        'html_class',
    )
