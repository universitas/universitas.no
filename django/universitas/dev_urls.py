""" Urls that are only used in development.  """
from debug_toolbar import urls as debug_toolbar_urls
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path, re_path

from .urls import urlpatterns

urlpatterns = [
    re_path(r'^__debug__/',
            include(debug_toolbar_urls)),  # django debug toolbar
    # serve media files from development server
    *static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),
    *urlpatterns,
]
