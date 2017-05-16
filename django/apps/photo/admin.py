# -*- coding: utf-8 -*-
"""
Admin for photo app.
"""

from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from django.utils.safestring import mark_safe
from sorl.thumbnail.admin import AdminImageMixin
from autocomplete_light.forms import modelform_factory
from .models import ImageFile, ProfileImage
import logging
logger = logging.getLogger(__name__)


class ThumbAdmin:
    exclude = ()

    @staticmethod
    def _img_tag(url, css=''):
        return mark_safe(f'<img style="{css}", src="{url}" />')

    def full_thumb(self, instance):
        if not instance.small:
            return '--'
        url = instance.small.url
        return self._img_tag(url, 'max-height: 150px;')

    def cropped_thumb(self, instance):
        if not instance.preview:
            return '--'
        url = instance.preview.url
        return self._img_tag(url)

    full_thumb.allow_tags = True  # type: ignore
    full_thumb.short_description = _('preview')  # type: ignore
    cropped_thumb.allow_tags = True  # type: ignore
    cropped_thumb.short_description = _('cropped')  # type: ignore


def autocrop(modeladmin, request, queryset):
    for image in queryset.all():
        image.cropping_method = image.CROP_PENDING
        image.save()


autocrop.short_description = _('Autocrop')  # type: ignore


class ImageAdmin(AdminImageMixin, ThumbAdmin, admin.ModelAdmin, ):

    form = modelform_factory(ImageFile, exclude=())
    actions = [autocrop]
    date_hierarchy = 'created'
    actions_on_top = True
    actions_on_bottom = True
    save_on_top = True
    list_per_page = 25
    list_display = [
        'id',
        'created',
        'source_file',
        'contributor',
        'cropping_method',
        'crop_box',
        'cropped_thumb',
        'full_thumb',
    ]
    list_editable = (
    )
    search_fields = (
        'source_file',
        'storyimage__caption',
        'frontpagestory__headline',
    )


@admin.register(ImageFile)
class ImageFileAdmin(ImageAdmin):

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.exclude(source_file__startswith=ProfileImage.UPLOAD_FOLDER)


@admin.register(ProfileImage)
class ProfileImageAdmin(ImageAdmin):
    pass
