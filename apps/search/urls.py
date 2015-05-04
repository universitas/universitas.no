"""URLs for the built-in site search functionality."""

from django.conf.urls import patterns, url
from .views import SearchView, SearchApiView

urlpatterns = patterns(
    '',
    url("^$", SearchView.as_view(), name="search"),
    url("^json/$", SearchApiView.as_view(), name="search_json"),
)
