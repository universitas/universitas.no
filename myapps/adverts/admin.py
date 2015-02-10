# -*- coding: utf-8 -*-

from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from django.contrib import admin
from django.db import models
import autocomplete_light

from myapps.photo.admin import ThumbAdmin
from sorl.thumbnail.admin import AdminImageMixin

from .models import Customer, AdChannel, Advert, AdFormat


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'contact_info']
    list_editable = []
    pass


@admin.register(Advert)
class AdvertAdmin(AdminImageMixin, admin.ModelAdmin, ThumbAdmin):
    form = autocomplete_light.modelform_factory(Advert, exclude=())
    list_display = ['__str__', 'customer', 'start_time', 'end_time', 'ad_type']
    list_editable = ['start_time', 'end_time']
    readonly_fields = ['get_html']
    pass


@admin.register(AdChannel)
class ChannelAdmin(admin.ModelAdmin):
    form = autocomplete_light.modelform_factory(AdChannel, exclude=())
    list_display = ['id', 'name', 'description', 'formats', 'active_ads', ]
    list_editable = ['name']
    pass


@admin.register(AdFormat)
class AdFormatAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'width', 'height', 'price', 'published']
    list_editable = ['name', 'width', 'height', 'price', 'published']
    pass
