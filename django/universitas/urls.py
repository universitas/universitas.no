"""Base url router for universitas.no"""
from api.urls import urlpatterns as api_urls
from apps.core.autocomplete_views import autocomplete_list
from apps.core.views import HumansTxtView, RobotsTxtView, search_404_view
from apps.frontpage.views import (
    frontpage_view, section_frontpage, storytype_frontpage
)
from apps.issues.views import PdfArchiveView, PubPlanView
from apps.photo.views import PhotoAppView
from apps.search import urls as search_urls
from apps.stories.feeds import LatestStories
from apps.stories.views import article_view
from autocomplete_light import urls as autocomplete_light_urls
from django.conf import settings
from django.contrib import admin
from django.urls import include, re_path
from django.views.generic import TemplateView

from . import redirect_urls

admin.autodiscover()

urlpatterns = [
    # DJANGO-ALLAUTH (login, password etc)
    re_path(r'^auth/', include('allauth.urls')),
    # RSS
    re_path(r'^rss/$', LatestStories(), name='rss'),
    # API
    re_path(r'^api/', include(api_urls)),

    # Frontpage
    re_path(r'^$', frontpage_view, name='frontpage'),

    # React apps
    re_path(r'^foto/$', PhotoAppView.as_view(), name='photoapp'),
    re_path(
        r'^prodsys',
        TemplateView.as_view(template_name='prodsys.html'),
        name='prodsys'
    ),

    # Flat pages
    re_path(
        r'^om_universitas/$',
        TemplateView.as_view(template_name='general-info.html'),
        name='general_info',
    ),
    re_path(
        r'^annonser/$',
        TemplateView.as_view(template_name='advert-info.html'),
        name='ad_info',
    ),
    re_path(r'^utgivelsesplan/$', PubPlanView.as_view(), name='pub_plan'),
    re_path(
        r'^utgivelsesplan/(?P<year>\d{4})/$',
        PubPlanView.as_view(),
        name='pub_plan_year'
    ),
    re_path(r'^pdf/$', PdfArchiveView.as_view(), name='pdf_archive'),
    re_path(r'^admin/', admin.site.urls),
    re_path(r'^robots.txt$', RobotsTxtView.as_view(), name='robots.txt'),
    re_path(r'^humans.txt$', HumansTxtView.as_view(), name='humans.txt'),
    re_path(r'^autocomplete', include(autocomplete_light_urls)),
    re_path(
        r'^autocomplete/menu$', autocomplete_list, name='autocomplete_list'
    ),
    re_path(r'^search/', include(search_urls)),
    re_path(r'^', include(redirect_urls)),
    re_path(
        r'^(?P<section>[a-z0-9-]+)/(?P<story_id>\d+)/(?P<slug>[a-z0-9-]*)/?$',
        article_view,
        name='article'
    ),
    re_path(r'^(?P<story_id>\d+?)/.*$', article_view, name='article_short'),
    re_path(
        r'^(?P<section>[a-z0-9-]+)/all/$', section_frontpage, name='section'
    ),
    re_path(
        r'^(?P<section>[a-z0-9-]+)/(?P<storytype>[a-z0-9-]+)/all/$',
        storytype_frontpage,
        name='storytype'
    ),
]

# redirect 404 to search page
if not settings.DEBUG:
    urlpatterns += [
        re_path(r'^(?P<slug>.+)/$', search_404_view, name='not_found'),
    ]
