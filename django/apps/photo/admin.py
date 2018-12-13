""" Admin for photo app. """

import logging

# from sorl.thumbnail.admin import AdminImageMixin
from django.contrib import admin, messages
from django.db.models import F
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _
from utils.sorladmin import AdminImageMixin

from .models import ImageFile
from .tasks import upload_imagefile_to_desken

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
    messages.add_message(
        request, messages.INFO, 'crop %s images' % queryset.count()
    )


autocrop.short_description = _('Autocrop')  # type: ignore


def upload_to_desken(modeladmin, request, queryset):
    for image_pk in queryset.values_list('pk', flat=True):
        upload_imagefile_to_desken.delay(image_pk)
    messages.add_message(
        request, messages.INFO, 'upload %s images' % queryset.count()
    )


upload_to_desken.short_description = _('Upload to desken')  # type: ignore


def merge_photos(modeladmin, request, queryset):
    queryset = queryset.annotate(pixelsize=F('full_width') * F('full_height')
                                 ).order_by("-pixelsize")
    first, *others = queryset
    try:
        msg = f'merged {", ".join(map(str, others))} images with {first}'
        first.merge_with(others)
        messages.add_message(request, messages.INFO, msg)
    except Exception as err:
        msg = f'merge failed: {err}'
        messages.add_message(request, messages.ERROR, msg)


merge_photos.short_description = _('Merge photos')  # type: ignore


@admin.register(ImageFile)
class ImageFileAdmin(
    AdminImageMixin,
    ThumbAdmin,
    admin.ModelAdmin,
):

    actions = [autocrop, upload_to_desken, merge_photos]
    date_hierarchy = 'created'
    actions_on_top = True
    actions_on_bottom = True
    save_on_top = True
    list_per_page = 25
    list_filter = ['category']
    list_display = [
        'id',
        'created',
        'original',
        'contributor',
        'category',
        'cropping_method',
        'crop_box',
        'cropped_thumb',
        'full_thumb',
    ]
    list_editable = [
        'category',
    ]
    search_fields = [
        'original',
    ]
    autocomplete_fields = [
        'contributor',
    ]
