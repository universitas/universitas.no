# -*- coding: utf-8 -*-
"""Urls to redirect"""
from django.conf.urls import url
from django.views.generic.base import RedirectView

urlpatterns = [
    # PHP utils from old website and other cruft that older browsers might
    # request.
    url(r'^favicon.ico$',
        RedirectView.as_view(url='/static/favicon/favicon.ico', permanent=False)),
    url(r'^(?P<base>.+)/(hl|tel):.+$',
        RedirectView.as_view(url=r'/%(base)s/', permanent=True)),
    url(r'^rss\.php$', RedirectView.as_view(url=r'/rss/', permanent=True)),
    # Retired pages from old website
    url(r'^inc/func/image\.inc\.php',
        RedirectView.as_view(url=None, permanent=True)),
    url(r'^arkivet/', RedirectView.as_view(url=None, permanent=True)),
    # Rebranded pages
    url(r'^nyhet/$', RedirectView.as_view(url=r'/nyheter/', permanent=True)),
    url(r'^vispor/$',
        RedirectView.as_view(url=r'/baksiden/vi-spor/',
                             permanent=True)),
    url(r'^nyheter/omverden/$',
        RedirectView.as_view(url=r'/nyheter/utenriks/', permanent=True)),
    url(r'^omverden/$',
        RedirectView.as_view(url=r'/nyheter/utenriks/',
                             permanent=True)),
    # Annoying bot doesn't understand href="tel:..."
]
