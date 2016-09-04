# -*- coding: utf-8 -*-
"""
Admin for photo app.
"""

from django.contrib import admin
from django.conf import settings
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _
from sorl.thumbnail.admin import AdminImageMixin
from sorl.thumbnail import get_thumbnail
from autocomplete_light.forms import modelform_factory
from .models import ImageFile, ProfileImage


class ThumbAdmin:
    exclude = ()

    def thumbnail(self, instance, width=200, height=100):
        url = settings.STATIC_URL + 'admin/img/icon-no.gif'
        if hasattr(instance, 'imagefile'):
            imagefile = instance.imagefile
        else:
            imagefile = instance
        if imagefile:
            source = imagefile.source_file
            try:
                thumb = get_thumbnail(source, '%sx%s' % (width, height))
                url = thumb.url
            except Exception:
                pass
        return mark_safe('<img src="{}">'.format(url))

    thumbnail.allow_tags = True
    thumbnail.short_description = _('preview')


def autocrop(modeladmin, request, queryset):
    for image in queryset.all():
        image.autocrop()

autocrop.short_description = _('Autocrop')


@admin.register(ImageFile)
class ImageFileAdmin(AdminImageMixin, ThumbAdmin, admin.ModelAdmin, ):
    form = modelform_factory(ImageFile, exclude=())
    actions = [autocrop]
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
        'crop_diameter',
        'from_left',
        'from_top',
        'thumbnail',
    )
    list_editable = (
        'crop_diameter',
        'from_left',
        'from_top',
    )
    search_fields = (
        'source_file',
        'storyimage__caption',
        'frontpagestory__headline',
    )


@admin.register(ProfileImage)
class ProfileImageAdmin(ImageFileAdmin):

    def get_queryset(self, request):
        qs = super(ProfileImageAdmin, self).get_queryset(request)
        return qs.filter(source_file__startswith=ProfileImage.UPLOAD_FOLDER)
