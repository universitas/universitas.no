"""Core views for webpage."""

import json
import logging
import re
import time
from functools import wraps

import requests

from api.frontpage import FrontpageStoryViewset
from api.publicstories import PublicStoryViewSet
from django.conf import settings
from django.http import HttpResponseRedirect
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views.generic.base import TemplateView

logger = logging.getLogger(__name__)
BASEPATH = 'dev'


def timeit(fn):
    @wraps(fn)
    def wrapped(*args, **kwargs):
        t0 = time.time()
        res = fn(*args, **kwargs)
        delta = (time.time() - t0) * 1000
        logger.debug(f'{fn.__name__} took {delta:.1f}ms')
        return res

    return wrapped


@timeit
def _react_render(redux_actions, request):
    path = request.path.replace('//', '/')
    try:
        context = requests.post(
            f'{settings.EXPRESS_SERVER_URL}{path}', json=redux_actions
        ).json()
        return context
    except requests.ConnectionError:
        logger.exception('Could not connect to express server')
        return {}


def react_frontpage_view(request, section=None, story=None, slug=None):
    redux_actions = []
    feed = FrontpageStoryViewset.as_view({'get': 'list'})(request)
    redux_actions.append({
        'type': 'newsfeed/FEED_FETCHED', 'payload': feed.data
    })

    if story:
        redux_actions.append({
            'type': 'publicstory/STORY_FETCHED',
            'payload': PublicStoryViewSet.as_view({'get': 'retrieve'})(
                request, pk=story
            ).data
        })

    ssr_context = _react_render(redux_actions, request)
    try:
        pathname = f"/{BASEPATH}{ssr_context['state']['location']['pathname']}"
        if pathname != request.path:
            logger.info(f'redirect {request.path} to {pathname}')
            return redirect(pathname)
        ssr_context['state'] = json.dumps(ssr_context['state'])
    except KeyError:
        pass

    return render(
        request, 'universitas-server-side-render.html',
        {'ssr': ssr_context}
    )


class TextTemplateView(TemplateView):
    """ Render plain text file. """

    def render_to_response(self, context, **response_kwargs):
        response_kwargs['content_type'] = 'text/plain'
        return super().render_to_response(context, **response_kwargs)


class HumansTxtView(TextTemplateView):
    """ humans.txt contains information about who made the site. """

    template_name = 'humans.txt'


class RobotsTxtView(TextTemplateView):
    """ robots.txt contains instructions for webcrawler bots. """

    if settings.DEBUG:
        template_name = 'robots-staging.txt'
    else:
        template_name = 'robots-production.txt'


def search_404_view(request, slug):
    search_terms = re.split(r'\W|_', slug)
    redirect_to = '{search}?q={terms}'.format(
        search=reverse('search:search'),
        terms='+'.join(search_terms),
    )
    return HttpResponseRedirect(redirect_to)
