"""URLs for the built-in site search functionality."""

from django.conf.urls import url

from .views import SearchApiView, SearchView

urlpatterns = [
    url("^$", SearchView.as_view(), name="search"),
    url("^json/$", SearchApiView.as_view(), name="search_json"),
]
