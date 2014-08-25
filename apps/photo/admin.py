# -*- coding: utf-8 -*-
"""
Admin for photo app.
"""

from django.contrib import admin
from . models import ImageFile
from sorl.thumbnail.admin import AdminImageMixin
import autocomplete_light


@admin.register(ImageFile)
class ImageFileAdmin(AdminImageMixin, admin.ModelAdmin):
    form = autocomplete_light.modelform_factory(ImageFile)
    list_display = (
        'id',
        'created',
        'source_file',
        'contributor',
    )

