# -*- coding: utf-8 -*-
"""Frontpage views"""
from django.shortcuts import render
from django.http import (
    HttpResponseRedirect,
    HttpResponsePermanentRedirect,
    Http404
)
from django.utils.http import base36_to_int
from django.views.decorators.cache import cache_page

from apps.core.views import search_404_view
from apps.stories.models import Story, Section, StoryType
from apps.frontpage.models import Frontpage, StoryModule
import logging
logger = logging.getLogger(__name__)

# from django.contrib.auth.decorators import login_required


def frontpage_layout(blocks):
    """ create layout grid from story modules """
    MAX_COLUMNS = 12
    PIX_C = 1000 / 12  # pixels per column for image sizing
    PIX_H = 150  # pixels per row
    MIN_H = -50
    HEADLINE_SIZES = [
        (12, 'xs'),
        (16, 's'),
        (22, 'm'),
        (30, 'l'),
    ]

    floor = []
    items = []
    columns_used = 0

    for block in blocks:
        if block.columns + columns_used > MAX_COLUMNS:
            # floor is filled. Finish it.
            floorheight = max(item.height for item in floor)
            ratio = MAX_COLUMNS / columns_used + 0.1
            columns_used = 0
            for bb in floor:
                story = bb.frontpage_story
                columns = round(bb.columns * ratio)
                columns_used += columns
                if columns_used > 12:
                    columns = columns + 12 - columns_used

                if story.imagefile:
                    image = story.imagefile
                    source = image.source_file
                    crop = image.get_crop()
                else:
                    source = None
                    crop = None

                headline_size = 'xl'
                headline = story.headline
                for length, size in HEADLINE_SIZES:
                    if len(headline) < length:
                        headline_size = size
                        break
                # logger.debug('{} {}'.format(headline, headline_size))

                item = {
                    'css_width': 'cols-{}'.format(columns),
                    'css_height': 'rows-{}'.format(floorheight),
                    'headline_class': 'headline-{size}'.format(
                        size=headline_size),
                    'image_size': '{width:.0f}x{height:.0f}'.format(
                        width=PIX_C * columns,
                        height=MIN_H + PIX_H * floorheight,
                    ),
                    'image': source,
                    'crop': crop,
                    'story': story,
                    'block': bb,
                }
                items.append(item)
            floor = []
            columns_used = 0

        floor.append(block)
        columns_used += block.columns
    return items


def get_frontpage_stories(story_queryset, frontpage=None):
    """ Find frontpage stories connected to queryset """
    if frontpage is None:
        frontpage = Frontpage.objects.root()

    stories = story_queryset.is_on_frontpage(frontpage)
    result = StoryModule.objects.filter(
        frontpage=frontpage,
        frontpage_story__story__in=stories
    ).prefetch_related('frontpage_story__imagefile')
    return result


def actual_frontpage(request, stories=None, frontpage=None):
    """ Shows the newspaper frontpage. """
    context = {}
    if stories is None:
        stories = Story.objects.published()

    blocks = get_frontpage_stories(stories).order_by('-position')[:30]

    context['frontpage_items'] = frontpage_layout(blocks)

    return render(request, 'frontpage.html', context)


@cache_page(10 * 60)
def cached_frontpage(request, *args, **kwargs):
    return actual_frontpage(request, *args, **kwargs)


def frontpage_view(request, *args, **kwargs):
    # Very hacky way of only caching for anauthenticated visitors.
    # if request.user.is_authenticated():
    #     func = actual_frontpage
    # else:
    #     func = cached_frontpage
    func = actual_frontpage
    return func(request, *args, **kwargs)


def section_frontpage(request, section):
    try:
        # is the slug a section name?
        section = Section.objects.get(slug=section)
        stories = Story.objects.filter(story_type__section=section).published()
        return frontpage_view(request, stories=stories)
    except Section.DoesNotExist:
        return fallback_view(request, slug=section)


def fallback_view(request, slug):
    try:
        # is the slug a story type?
        story_type = StoryType.objects.get(slug=slug)
        return HttpResponseRedirect(story_type.get_absolute_url())
    except StoryType.DoesNotExist:
        try:
            # is the slug a legacy base36 short url
            story = Story.objects.get(pk=base36_to_int(slug))
            return HttpResponsePermanentRedirect(story.get_absolute_url())
        except (ValueError, Story.DoesNotExist):
            return search_404_view(request, slug)


def storytype_frontpage(request, section, storytype):
    try:
        story_type = StoryType.objects.get(slug=storytype)
    except StoryType.DoesNotExist:
        raise Http404('No such section and story type')
    stories = Story.objects.filter(story_type=story_type).published()
    return frontpage_view(request, stories=stories)
