"""Core views for webpage."""

import re

from django.conf import settings
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.views.generic.base import TemplateView


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
