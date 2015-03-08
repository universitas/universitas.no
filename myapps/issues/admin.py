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
from django.utils.translation import ugettext_lazy as _

class ThumbAdmin:
    exclude = ()

    def thumbnail(self, instance, width=200, height=200):
        try:
            source = instance.get_thumbnail()
            thumb = get_thumbnail(source, '%sx%s' % (width, height))
            url = thumb.url
        except FileNotFoundError:
            url = '/static/admin/img/icon-no.gif'
        if instance.pdf:
            html = '<a href="{pdf}"><img src="{thumb}"></a>'.format(
                thumb=url, pdf=instance.pdf.url,
            )
        else:
            html = '<p>{}</p>'.format(_('PDF is not uploaded yet.'))
        return mark_safe(html)

    thumbnail.allow_tags = True


@admin.register(PrintIssue)
class PrintIssueAdmin(AdminImageMixin, admin.ModelAdmin, ThumbAdmin):
    date_hierarchy = 'publication_date'
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
