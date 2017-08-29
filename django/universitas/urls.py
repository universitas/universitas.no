"""Base url router for universitas.no"""
from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from apps.core.views import RobotsTxtView, HumansTxtView
from apps.search import urls as search_urls
from apps.core.autocomplete_views import autocomplete_list
from apps.frontpage.views import (
    frontpage_view, section_frontpage, storytype_frontpage,)
from apps.core.views import search_404_view
from apps.issues.views import PdfArchiveView, PubPlanView
from apps.stories.views import article_view
from apps.photo.views import PhotoAppView
from apps.stories.feeds import LatestStories
from autocomplete_light import urls as autocomplete_light_urls
from .redirect_urls import urlpatterns as redirect_urls
from api.urls import urlpatterns as api_urls
# from watson import urls as watson_urls

from django.views.generic import TemplateView

admin.autodiscover()

urlpatterns = [
    # RSS
    url(r'^rss/$', LatestStories(), name='rss'),
    # API
    url(r'^api/', include(api_urls)),

    # Frontpage
    url(r'^$', frontpage_view, name='frontpage'),

    # React apps
    url(r'^foto/$', PhotoAppView.as_view(), name='photoapp'),
    url(r'^prodsys', TemplateView.as_view(template_name='prodsys.html')),

    # Flat pages
    url(r'^om_universitas/$',
        TemplateView.as_view(template_name='general-info.html'),
        name='general_info',),
    url(r'^annonser/$',
        TemplateView.as_view(template_name='advert-info.html'),
        name='ad_info',),
    url(r'^utgivelsesplan/$',
        PubPlanView.as_view(),
        name='pub_plan'),
    url(r'^utgivelsesplan/(?P<year>\d{4})/$',
        PubPlanView.as_view(),
        name='pub_plan_year'),
    url(r'^pdf/$',
        PdfArchiveView.as_view(),
        name='pdf_archive'),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^robots.txt$', RobotsTxtView.as_view(), name='robots.txt'),
    url(r'^humans.txt$', HumansTxtView.as_view(), name='humans.txt'),

    url(r'^autocomplete', include(autocomplete_light_urls)),
    url(r'^autocomplete/menu$', autocomplete_list, name='autocomplete_list'),

    url(r'^search/', include(search_urls, namespace='watson')),
    url(r'^', include(redirect_urls, namespace='redirect')),

    url(r'^(?P<section>[a-z0-9-]+)/(?P<story_id>\d+)/(?P<slug>[a-z0-9-]*)/?$',
        article_view, name='article'),
    url(r'^(?P<story_id>\d+?)/.*$',
        article_view, name='article_short'),
    url(r'^(?P<section>[a-z0-9-]+)/(?P<storytype>[a-z0-9-]+)/$',
        storytype_frontpage, name='storytype'),
    url(r'^(?P<section>[a-z0-9-]+)/$',
        section_frontpage, name='section'),
]

# redirect 404 to search page
if not settings.DEBUG:
    urlpatterns += [
        url(r'^(?P<slug>.+)/$', search_404_view, name='not_found'),
    ]
