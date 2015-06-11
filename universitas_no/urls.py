# -*- coding: utf-8 -*-
from django.conf.urls.static import static
from django.conf.urls import patterns, include, url
from django.contrib import admin
from apps.core.views import RobotsTxtView, HumansTxtView
from apps.search import urls as search_urls
from apps.core.autocomplete_views import autocomplete_list
from apps.frontpage.views import frontpage_view, section_frontpage, storytype_frontpage
from apps.issues.views import PdfArchiveView, PubPlanView
from apps.stories.views import article_view
from autocomplete_light import urls as autocomplete_light_urls
# from watson import urls as watson_urls

from django.views.generic import TemplateView, RedirectView
from django.conf import settings

admin.autodiscover()


# Content
urlpatterns = patterns(
    '',
    # forside
    url(r'^$', frontpage_view, name='frontpage'),
    url(r'^(?P<section>[a-z0-9-]+)/(?P<story_id>\d+)/(?P<slug>[a-z0-9-]*)/?$',
        article_view, name='article'),
    # så lenge id er med, så er det greit.
    url(r'^(?P<story_id>\d+?)/.*$',
        article_view, name='article_short'),
)
# Static content
urlpatterns += patterns(
    '',
    url(r'^om_universitas/$',
        TemplateView.as_view(template_name='general-info.html'),
        name='general_info',),
    url(r'^kontakt/$',
        TemplateView.as_view(template_name='contact-info.html'),
        name='contact_info',),
    url(r'^annonser/$',
        TemplateView.as_view(template_name='advert-info.html'),
        name='ad_info',),
)

# PDF and issues
urlpatterns += patterns(
    '',
    url(r'^pdf/$',
        PdfArchiveView.as_view(),
        name='pdf_archive'),
    url(r'^utgivelsesplan/(?P<year>\d{4})/$',
        PubPlanView.as_view(),
        name='pub_plan'),
    url(r'^utgivelsesplan/$',
        PubPlanView.as_view(),
        name='pub_plan'),
)

urlpatterns += patterns(
    '',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^robots.txt$', RobotsTxtView.as_view(), name='robots.txt'),
    url(r'^humans.txt$', HumansTxtView.as_view(), name='humans.txt'),
    url(r'^favicon.ico$', RedirectView.as_view(url='/static/images/favicon.ico'), name='favicon.ico'),
)

# Autocomplete for admin forms
urlpatterns += patterns(
    '',
    url(r'^autocomplete', include(autocomplete_light_urls)),
    url(r'^autocomplete', include(autocomplete_light_urls)),
    url(r'^autocomplete/menu$', autocomplete_list, name='autocomplete_list'),
)

# Main site search
urlpatterns += patterns(
    '',
    url(r'^search/', include(search_urls, namespace='watson')),
)

# Django debug toolbar
if settings.DEBUG:
    import debug_toolbar
    urlpatterns += patterns(
        '',
        url(r'^__debug__/', include(debug_toolbar.urls)),
    )
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


urlpatterns += patterns(
    '',
    url(r'^(?P<section>[a-z0-9-]+)/$', section_frontpage, name='section'),
    # artikkelvisning
    url(r'^(?P<section>[a-z0-9-]+)/(?P<storytype>[a-z0-9-]+)/$',
        storytype_frontpage,
        name='storytype'),
)
