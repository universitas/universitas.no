# -*- coding: utf-8 -*-
"""
Admin for stories app.
"""

from django.contrib import admin
from .models import Sak, Prodsak, DiskSvar, Bilde
from django.utils.translation import ugettext_lazy as _


@admin.register(Sak)
class SakAdmin(admin.ModelAdmin):
    save_on_top = True
    list_per_page = 50
    list_display = (
        'id_sak',
        'publisert',
        'overskrift',
        'stikktittel',
        'ingress',
        'undersak',
        'mappe',
        'dato',
        'lesninger',
    )

    list_editable = (
        'publisert',
    )
    search_fields = (
        'byline',
        'overskrift',
    )
    fieldsets = (
        ('header', {
            'fields': (
                ('dato', 'publisert', 'diskusjon'),
                ('overskrift', 'stikktittel', 'byline'),
            ),
        }),

        ('content', {
            'fields': (
                ('brodtekst',),
                ('sitat', 'undersak', ),
            ),
        })

    )


def move_to_archive(modeladmin, request, queryset):
    for story in queryset:
        story.produsert = Prodsak.ARCHIVED
        story.save()

move_to_archive.short_description = _('Move story to archive.')


class ProdusertFilter(admin.SimpleListFilter):
    # Human-readable title which will be displayed in the
    # right admin sidebar just above the filter options.
    title = _('status')

    # Parameter for the filter that will be used in the URL query.
    parameter_name = 'status'

    def lookups(self, request, model_admin):
        return (
            ('active', _('active')),
            ('archive', _('archived')),
        )

    def queryset(self, request, queryset):
        if self.value() == 'active':
            return queryset.exclude(
                produsert=Prodsak.ARCHIVED).extra(where=[
                    ''' (prodsak_id, version_no) IN (
                SELECT prodsak_id, MAX(version_no)
                FROM prodsak
                GROUP BY prodsak_id
                ) '''
                ]).order_by('produsert', '-dato')

        if self.value() == 'archive':
            return queryset.filter(
                produsert=Prodsak.ARCHIVED).order_by(
                '-prodsak_id',
                '-version_no')


@admin.register(Prodsak)
class ProdsakAdmin(admin.ModelAdmin):

    list_filter = (ProdusertFilter, 'produsert')
    actions = [move_to_archive]

    list_display = (
        'id',
        'prodsak_id',
        'arbeidstittel',
        'journalist',
        'kommentar',
        'mappe',
        'flagg',
        'produsert',
        'version_no',
        'dato',
    )
    list_editable = (
        'produsert',
    )
    search_fields = (
        'prodsak_id',
        'arbeidstittel',
        'kommentar',
    )


@admin.register(DiskSvar)
class DiskSvarAdmin(admin.ModelAdmin):
    list_display = (
        'id_svar',
        'navn',
        'tekst',
        'sensurert',
        'tid',
        'epost',
        'ip',
        'status',
        # 'sak',
        'epost_sendt',
    )
    list_editable = (
        'sensurert',
    )
    search_fields = (
        'navn',
        'tekst',
    )


@admin.register(Bilde)
class BildeAdmin(admin.ModelAdmin):
    list_display = (
        'id_bilde',
        'path',
        # 'sak__overskrift',
        # 'bildetekst',
        'size',
        'crop',
    )
