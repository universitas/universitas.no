# -*- coding: utf-8 -*-
"""
Urls that are only used for development.
"""
from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static

from debug_toolbar import urls as debug_toolbar_urls

from .urls import urlpatterns

# django debug toolbar
urlpatterns += [
    url(r'^__debug__/', include(debug_toolbar_urls)),
]

# serve media files from development server
urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)
