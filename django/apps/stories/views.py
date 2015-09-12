# -*- coding: utf-8 -*-i
"""
Views for articles
"""
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from .models import Story
from django.http import HttpResponseRedirect
import logging
logger = logging.getLogger('universitas')


def article_view(request, story_id, **section_and_slug):
    template = 'story.html'
    story = get_object_or_404(Story.objects.published(), pk=story_id,)
    correct_url = story.get_absolute_url()

    if request.path != correct_url:
        return HttpResponseRedirect(correct_url)

    context = {'story': story, }
    story.visit_page(request)
    return render(request, template, context,)
