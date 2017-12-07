"""URLs for the built-in site search functionality."""

from django.conf.urls import url

from .views import SearchView

app_name = 'search'

urlpatterns = [
    url(r'^$', SearchView.as_view(), name='search'),
]
