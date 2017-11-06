""" Views for articles """
import logging

from apps.core.views import search_404_view
from django.core.cache import cache
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import render
from django.utils import translation

from .models import Story

logger = logging.getLogger(__name__)
FIVE_MINUTES = 60 * 5


def article_view(request, story_id, **section_and_slug):
    try:
        story = Story.objects.get(pk=story_id)
    except Story.DoesNotExist:
        slug = section_and_slug.get('slug')
        if slug:
            return search_404_view(request, slug)
        else:
            raise Http404('This page does not exist')

    correct_url = story.get_absolute_url()
    if request.path != correct_url:
        return HttpResponseRedirect(correct_url)

    if request.user.is_staff:
        return _render_story(request, story)
    else:
        if story.publication_status != Story.STATUS_PUBLISHED:
            raise Http404('You are not supposed to visit this page')
        cache_key = f'{story.pk}_{story.modified:%s}'
        response = cache.get(cache_key)
        if not response:
            response = _render_story(request, story)
            cache.set(cache_key, response, timeout=FIVE_MINUTES)
        if story.valid_page_view(request):
            story.register_visit_in_cache()
        return response


def _render_story(request, story, template='story.html'):
    translation.activate(story.language)
    return render(
        request,
        template,
        {'story': story},
    )
