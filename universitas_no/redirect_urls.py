# -*- coding: utf-8 -*-
"""Urls to redirect"""
from django.conf.urls import url
from django.views.generic.base import RedirectView
urlpatterns = [
    # PHP utils from old website
    url(r'^(?P<base>.+)/hl:.+$', RedirectView.as_view(url=r'/%(base)s/')),
    url(r'^rss\.php$', RedirectView.as_view(url=r'/rss/')),
    # Retired pages from old website
    url(r'^inc/func/image\.inc\.php', RedirectView.as_view(url=None)),
    url(r'^arkivet/', RedirectView.as_view(url=None)),
    # Rebranded pages
    url(r'^nyhet/$', RedirectView.as_view(url=r'/nyheter/')),
]
