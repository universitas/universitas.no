"""Core views for webpage."""

import json
import logging
import re
import time
from functools import wraps

import requests

from api.frontpage import FrontpageStoryViewset
from api.publicstories import PublicStoryViewSet
from api.user import AvatarUserDetailsSerializer
from django.conf import settings
from django.http import HttpResponseRedirect
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views.generic.base import TemplateView

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


def react_frontpage_view(request, section=None, story=None, slug=None):
    redux_actions = []
    feed = FrontpageStoryViewset.as_view({'get': 'list'})(request)
    redux_actions.append({
        'type': 'newsfeed/FEED_FETCHED', 'payload': feed.data
    })

    if story:
        response = PublicStoryViewSet.as_view({'get': 'retrieve'})(
            request, pk=story
        )
        payload = {
            **response.data,
            'HTTPstatus': response.status_code,
            'id': int(story),
        }

        redux_actions.append({
            'type': 'publicstory/STORY_FETCHED', 'payload': payload
        })

    if request.user.is_authenticated:
        redux_actions.append({
            'type': 'auth/REQUEST_USER_SUCCESS',
            'payload': AvatarUserDetailsSerializer(
                request.user, context={'request': request}
            ).data,
        })

    ssr_context = _react_render(redux_actions, request)

    if request.user.is_anonymous and ssr_context.get('state'):
        ssr_context['state']['auth'] = None

    try:
        pathname = ssr_context['state']['location']['pathname']
        if pathname != request.path:
            logger.info(f'redirect {request.path} to {pathname}')
            return redirect(pathname)
    except KeyError:
        pass

    status_code = ssr_context.pop('HTTPStatus', 200)
    if status_code == 404 and request.path[-1] != '/':
        return redirect(request.path + '/')

    return render(
        request,
        template_name='universitas-server-side-render.html',
        context={'ssr': ssr_context},
        status=status_code,
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
