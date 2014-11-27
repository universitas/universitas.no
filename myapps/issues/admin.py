# -*- coding: utf-8 -*-
"""
Admin for printissues app
"""
from django.contrib import admin
from . models import PrintIssue
from sorl.thumbnail.admin import AdminImageMixin
from sorl.thumbnail import get_thumbnail
import autocomplete_light
from django.utils.safestring import mark_safe


class ThumbAdmin:
    exclude = ()

    def thumbnail(self, instance, width=200, height=200):
        url = '/static/admin/img/icon-no.gif'
        try:
            if hasattr(instance, 'cover_page'):
                imagefile = instance.cover_page
            else:
                imagefile = instance
            if imagefile:
                source = imagefile.file
                thumb = get_thumbnail(source, '%sx%s' % (width, height))
                url = thumb.url
        except FileNotFoundError:
            pass
        if instance.pdf:
            html = '<a href="{pdf}"><img src="{thumb}"></a>'.format(
                thumb=url, pdf=instance.pdf.url,
            )
        else:
            html = '<img src="{thumb}">'.format(thumb=url,)
        return mark_safe(html)

    thumbnail.allow_tags = True


@admin.register(PrintIssue)
class PrintIssueAdmin(AdminImageMixin, admin.ModelAdmin, ThumbAdmin):
    actions_on_top = True
    actions_on_bottom = True
    save_on_top = True
    # list_per_page = 25
    list_display = (
        'issue_name',
        'publication_date',
        'pages',
        'pdf',
        'thumbnail',
        'text',
    )
    search_fields = (
        'text',
        'pdf',
    )
    fieldsets = (
        ('',
            {
                'fields': (
                    ('issue_name', 'pages', 'publication_date',),
                    ('pdf', 'thumbnail',)
                ),
            },
         ),
    )
    readonly_fields = (
        'thumbnail', 'text', 'pages',
    )
