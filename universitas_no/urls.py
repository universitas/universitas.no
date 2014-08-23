# -*- coding: utf-8 -*-
"""
Url config for universitas.no.
"""
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from django.contrib import admin
from apps.core.views import RobotsTxtView, HumansTxtView
from apps.frontpage.views import frontpageView
from apps.stories.views import articleView

admin.autodiscover()


urlpatterns = patterns(
    '',
    url(r'^$', frontpageView, name='frontpage'),
    url(r'^$/(?P<section>[a-z]+)/(?P<story_id>\d+)/(?P<slug>[a-z\-]+)/$', articleView, name='article'),
)

urlpatterns += patterns(
    '',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^foundation/$', TemplateView.as_view(template_name='foundation.html'), name='foundation_demo',),
    url(r'^robots.txt$', RobotsTxtView.as_view(), name='robots.txt'),
    url(r'^humans.txt$', HumansTxtView.as_view(), name='humans.txt'),
)


if settings.DEBUG:
    import debug_toolbar
    urlpatterns += patterns(
        '',
        url(r'^__debug__/', include(debug_toolbar.urls)),
    )
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
