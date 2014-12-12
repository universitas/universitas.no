# -*- coding: utf-8 -*-
"""
Admin for photo app.
"""

from django.contrib import admin
from . models import ImageFile
from sorl.thumbnail.admin import AdminImageMixin
from sorl.thumbnail import get_thumbnail
import autocomplete_light
from django.utils.safestring import mark_safe


class ThumbAdmin:
    exclude=()
    def thumbnail(self, instance, width=200, height=100):
        url = '/static/admin/img/icon-no.gif'
        if hasattr(instance, 'imagefile'):
            imagefile = instance.imagefile
        else:
            imagefile = instance
        if imagefile:
            source = imagefile.source_file
            thumb = get_thumbnail(source, '%sx%s' % (width, height))
            url = thumb.url
        return mark_safe('<img src="{}">'.format(url))

    thumbnail.allow_tags = True


@admin.register(ImageFile)
class ImageFileAdmin(AdminImageMixin, admin.ModelAdmin, ThumbAdmin):
    form = autocomplete_light.modelform_factory(ImageFile, exclude=())
    date_hierarchy = 'created'
    actions_on_top = True
    actions_on_bottom = True
    save_on_top = True
    list_per_page = 25
    list_display = (
        'id',
        'created',
        'source_file',
        'contributor',
        'cropping_method',
        'horizontal_centre',
        'vertical_centre',
        'thumbnail',
    )
    list_editable = (
        'horizontal_centre',
        'vertical_centre',
    )
    search_fields = (
        'source_file',
        'storyimage__caption',
        'frontpagestory__headline',
        )
