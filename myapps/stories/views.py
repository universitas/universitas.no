# -*- coding: utf-8 -*-i
"""
Views for articles
"""
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from .models import Story, StoryImage
from django.http import HttpResponseRedirect, Http404
import logging
logger = logging.getLogger('universitas')

from django.contrib.auth.decorators import login_required

@login_required
def article_view(request, story_id, **section_and_slug):
    template = 'story.html'
    story = get_object_or_404(Story.objects.published(), pk=story_id,)
    correct_url = story.get_absolute_url()

    if request.path != correct_url:
        return HttpResponseRedirect(correct_url)

    try:
        header_image = story.images().top().first().child
    except AttributeError:
        header_image = None

    context = {
        'story': story,
        'header_image': header_image,
    }

    return render(request, template, context,)

