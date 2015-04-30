# -*- coding: utf-8 -*-
"""
    Core views for webpage.
"""

from django.views.generic.base import TemplateView
from django.conf import settings


class TextTemplateView(TemplateView):

    """ Render plain text file. """

    def render_to_response(self, context, **response_kwargs):
        response_kwargs['content_type'] = 'text/plain'
        return super(
            TemplateView,
            self).render_to_response(
            context,
            **response_kwargs)


class HumansTxtView(TextTemplateView):

    """ humans.txt contains information about who made the site. """

    template_name = 'humans.txt'


class RobotsTxtView(TextTemplateView):

    """ robots.txt contains instructions for webcrawler bots. """

    if settings.DEBUG:
        template_name = 'robots-staging.txt'
    else:
        template_name = 'robots-production.txt'
