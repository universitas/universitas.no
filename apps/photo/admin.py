# -*- coding: utf-8 -*-
"""
Admin for photo app.
"""

from django.contrib import admin
from . models import ImageFile
from sorl.thumbnail.admin import AdminImageMixin


@admin.register(ImageFile)
class ImageFileAdmin(AdminImageMixin, admin.ModelAdmin):
    pass
    # list_display = (
    #     'id',
    #     'created',
    #     'source_file',
    #     'contributor',
    # )
