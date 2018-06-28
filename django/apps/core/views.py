"""Core views for webpage."""

import json
import logging
import re

import requests

from api.frontpage import FrontpageStoryViewset
from api.publicstories import PublicStoryViewSet
from django.conf import settings
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views.generic.base import TemplateView

logger = logging.getLogger(__name__)


def _react_render(redux_actions, request):
    try:
        context = requests.post(
            f'{settings.EXPRESS_SERVER_URL}{request.path}', json=redux_actions
        ).json()
        context['state'] = json.dumps(context.get('state', {}))
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
    logger.debug(f'{redux_actions} {ssr_context.get("state")}')
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
