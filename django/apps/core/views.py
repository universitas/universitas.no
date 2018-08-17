"""Core views for webpage."""

import json
import logging
import time
from functools import wraps

import requests

from api.frontpage import FrontpageStoryViewset
from api.publicstories import PublicStoryViewSet
from api.user import AvatarUserDetailsSerializer
from django.conf import settings
from django.shortcuts import redirect, render
from django.views.generic.base import TemplateView
from django.core.cache import cache

logger = logging.getLogger(__name__)


def timeit(fn):
    @wraps(fn)
    def timeit_wrapper(*args, **kwargs):
        t0 = time.time()
        res = fn(*args, **kwargs)
        delta = (time.time() - t0) * 1000
        logger.debug(f'{fn.__name__} took {delta:.1f}ms')
        return res

    return timeit_wrapper


@timeit
def _react_render(redux_actions, request):
    """Server side rendering of react app"""
    data = {'actions': redux_actions, 'url': request.build_absolute_uri()}
    session = requests.Session()
    adapter = requests.adapters.HTTPAdapter(max_retries=8)
    session.mount(settings.EXPRESS_SERVER_URL, adapter)
    path = request.path.replace('//', '/').lstrip('/')
    url = f'{settings.EXPRESS_SERVER_URL}/{path}'
    try:
        response = session.post(url, json=data)
    except requests.ConnectionError:
        logger.exception('Could not connect to express server')
        return {'state': {}, 'error': 'ConnectionError'}
    try:
        return response.json()
    except json.JSONDecodeError:
        return {'state': {}, 'error': response.content}


def get_redux_actions(request, story):
    """Redux actions to simulate data prefetching server side rendering."""
    actions = []

    # frontpage news feed
    news_feed = FrontpageStoryViewset.as_view({'get': 'list'})(request)
    actions.append({
        'type': 'newsfeed/FEED_FETCHED', 'payload': news_feed.data
    })

    # user authentication
    if request.user.is_authenticated:
        actions.append({
            'type': 'auth/REQUEST_USER_SUCCESS',
            'payload': AvatarUserDetailsSerializer(
                request.user, context={'request': request}
            ).data,
        })
    else:
        actions.append({
            'type': 'auth/REQUEST_USER_FAILED', 'payload': {},
            'error': 'anonymous user'
        })

    # story content
    if story:
        response = PublicStoryViewSet.as_view({'get': 'retrieve'})(
            request, pk=story
        )
        actions.append({
            'type': 'publicstory/STORY_FETCHED', 'payload': {
                **response.data,
                'HTTPstatus': response.status_code,
                'id': int(story),
            }
        })

    return actions


def clear_cached_story(story):
    cache_key = f'cached_page_{story.pk}'
    cache.delete(cache_key)


def clear_cached_path(path):
    cache_key = f'cached_page_{path}'
    cache.delete(cache_key)


def react_frontpage_view(request, section=None, story=None, slug=None):

    cache_key = f'cached_page_{story or request.path}'

    if request.user.is_anonymous:
        # try:
        response, path = cache.get(cache_key, (None, None))
        # except Exception:
        # cache.delete(cache_key)
        if response:
            if path != request.path:
                return redirect(path)
            logger.debug(f'{cache_key} {request}')
            return response

    redux_actions = get_redux_actions(request, story)
    ssr_context = _react_render(redux_actions, request)

    # if request.user.is_anonymous and ssr_context.get('state'):
    #     ssr_context['state']['auth'] = None

    try:
        pathname = ssr_context['state']['location']['pathname']
        if pathname != request.path:
            return redirect(pathname)
    except KeyError:
        pass

    status_code = ssr_context.pop('HTTPStatus', 200)
    if status_code == 404 and request.path[-1] != '/':
        return redirect(request.path + '/')

    response = render(
        request,
        template_name='universitas-server-side-render.html',
        context={'ssr': ssr_context},
        status=status_code,
    )

    if request.user.is_anonymous and status_code == 200:
        TEN_MINUTES = 60 * 10
        cache.set(cache_key, (response, request.path), TEN_MINUTES)

    return response


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
