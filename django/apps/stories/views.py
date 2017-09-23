# -*- coding: utf-8 -*-i
"""
Views for articles
"""
import logging

from apps.core.views import search_404_view
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import render
from django.utils import translation

from .models import Story

logger = logging.getLogger(__name__)


def article_view(request, story_id, **section_and_slug):
    template = 'story.html'
    try:
        story = Story.objects.get(pk=story_id)
    except Story.DoesNotExist:
        slug = section_and_slug.get('slug')
        if slug:
            return search_404_view(request, slug)
        else:
            raise Http404('This page does not exist')

    if not request.user.is_staff:
        if story.publication_status != Story.STATUS_PUBLISHED:
            raise Http404('You are not supposed to visit this page')

    correct_url = story.get_absolute_url()

    if request.path != correct_url:
        return HttpResponseRedirect(correct_url)

    translation.activate(story.language)

    context = {
        'story': story,
    }
    response = render(
        request,
        template,
        context,
    )
    story.visit_page(request)
    return response
