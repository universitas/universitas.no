# -*- coding: utf-8 -*-
"""
Admin for contributors app.
"""

from django.contrib import admin
from django.template import Context, Template
from django.utils.safestring import mark_safe

import autocomplete_light

from . import models
from apps.stories.admin import BylineInline

def byline_image(obj):
    t = Template("{% load byline_image %}{% byline_image contributor size %}")
    d = {"contributor": obj, "size": "80x80"}
    html = t.render(Context(d))
    return mark_safe(html)

@admin.register(models.Contributor)
class ContributorAdmin(admin.ModelAdmin):
    form = autocomplete_light.modelform_factory(models.Contributor, exclude=())
    list_display = (
        'display_name',
        'bylines_count',
        'verified',
        byline_image,
    )
    list_editable = (
        'display_name',
        'verified',
    )
    search_fields = (
        'display_name',
    )

    inlines = [
        BylineInline,
    ]
