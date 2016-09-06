# -*- coding: utf-8 -*-

from django.contrib import admin
from django.utils.translation import ugettext_lazy as _

from apps.photo.admin import ThumbAdmin
from sorl.thumbnail.admin import AdminImageMixin

from .models import Customer, AdChannel, Advert, AdFormat


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'contact_info']
    list_editable = []


@admin.register(Advert)
class AdvertAdmin(AdminImageMixin, admin.ModelAdmin, ThumbAdmin):
    save_as = True
    save_on_top = True
    list_display = [
        '__str__',
        'customer',
        'start_time',
        'end_time',
        'ad_type',
        'status',
        'ordering',
        'extra_classes',
        'channels',
    ]
    list_editable = [
        'start_time',
        'end_time',
        'status',
        'ordering',
        'extra_classes',
    ]
    readonly_fields = ['get_html']


def create_dummy_ads(modeladmin, request, queryset):
    create_dummy_ads.short_description = _(
        'Create dummy adverts.')
    for channel in queryset:
        for adformat in channel.ad_formats.all():
            dummy_ad = Advert.objects.create_dummy(adformat)
            dummy_ad.ad_channels.add(channel)


@admin.register(AdChannel)
class ChannelAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'name',
        'description',
        'formats',
        'active_ads',
        'extra_classes',
        'max_at_once',
    ]
    list_editable = [
        'extra_classes',
        'description',
        'max_at_once',
    ]
    actions = [create_dummy_ads, ]


@admin.register(AdFormat)
class AdFormatAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'width', 'height', 'price', 'published']
    list_editable = ['name', 'width', 'height', 'price', 'published']
