"""Base url router for universitas.no"""
from api.urls import urlpatterns as api_urls
from apps.core.views import HumansTxtView, RobotsTxtView, react_frontpage_view
from apps.stories.feeds import LatestStories
from django.conf import settings
from django.contrib import admin
from django.contrib.staticfiles.storage import staticfiles_storage
from django.http import HttpResponse
from django.shortcuts import redirect
from django.urls import include, re_path
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView

admin.autodiscover()


def favicon_redirect(request, filename):
    return redirect(staticfiles_storage.url(f'favicon/{filename}'))


urlpatterns = [
    # RSS
    re_path(r'^rss/$', LatestStories(), name='rss'),
    re_path(r'^rss', RedirectView.as_view(pattern_name='rss')),
    # DJANGO-ALLAUTH (login, password etc)
    re_path(r'^auth/', include('allauth.urls')),
    # FAVICON
    re_path(r'^.*?([\w\-]+\.(?:png|ico))$', favicon_redirect),
    # API
    re_path(r'^api/', include(api_urls)),
    # React apps
    re_path(
        r'^adsense-fallback/$',
        TemplateView.as_view(template_name='adsense-fallback.html')
    ),
    # prodsys
    re_path(
        r'^prodsys',
        TemplateView.as_view(template_name='prodsys.html'),
        name='prodsys'
    ),
    # admin
    re_path(r'^admin/', admin.site.urls),
    re_path(r'^robots.txt$', RobotsTxtView.as_view(), name='robots.txt'),
    re_path(r'^humans.txt$', HumansTxtView.as_view(), name='humans.txt'),
    re_path(
        f'^{settings.FACEBOOK_DOMAIN_VERIFICATION}.html$',
        lambda request: HttpResponse(settings.FACEBOOK_DOMAIN_VERIFICATION),
        name='facebook_verification'
    ),
    # react story
    re_path(
        r'^(?P<section>[\w-]+)/?(?P<story>\d+)(?P<slug>/.*)/?$',
        react_frontpage_view,
        name='ssr',
    ),
    re_path(r'^(?P<story>\d+)/$', react_frontpage_view, name='shortlink'),
    # react frontpage
    re_path(r'', react_frontpage_view, name='ssr_fallback'),
]
