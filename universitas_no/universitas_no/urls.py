# -*- coding: utf-8 -*-
"""
Url config for universitas.no.
"""
from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from django.contrib import admin
from core.views import RobotsTxtView, HumansTxtView
admin.autodiscover()

urlpatterns = patterns(
    '',
    # Examples:
    # url(r'^$', 'universitas_no.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^foundation/$', TemplateView.as_view(template_name='foundation.html'), name='foundation_demo',),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^robots.txt$', RobotsTxtView.as_view(), name='robots.txt'),
    url(r'^humans.txt$', HumansTxtView.as_view(), name='humans.txt')
)

