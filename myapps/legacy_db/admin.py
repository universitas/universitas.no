# -*- coding: utf-8 -*-
"""
Admin for stories app.
"""

from django.contrib import admin
from .models import Sak, Prodsak, DiskSvar, Bilde


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


@admin.register(Prodsak)
class ProdsakAdmin(admin.ModelAdmin):
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
        'tekst',
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