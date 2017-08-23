"""Frontpage views"""
from django.shortcuts import render
from django.http import (
    HttpResponseRedirect,
    HttpResponsePermanentRedirect,
    Http404
)
from django.utils.http import base36_to_int
from django.utils.decorators import available_attrs
from django.views.decorators.cache import cache_page
from functools import wraps

from apps.core.views import search_404_view
from apps.stories.models import Story, Section, StoryType
from apps.frontpage.models import Frontpage, StoryModule
import logging
logger = logging.getLogger(__name__)

# from django.contrib.auth.decorators import login_required


def anonymous_cache(timeout):
    def decorator(view_func):
        @wraps(view_func, assigned=available_attrs(view_func))
        def _wrapped_view(request, *args, **kwargs):

            if request.user.is_authenticated():
                return (view_func)(request, *args, **kwargs)
            else:
                return cache_page(timeout)(view_func)(request, *args, **kwargs)
        return _wrapped_view
    return decorator


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
    floor_number = 0

    ad_channels = {
        0: 'forside banner 1',
        5: 'forside banner 2',
        10: 'forside banner 3',
        15: 'forside banner 4',
    }

    for block in blocks:
        if block.columns + columns_used > MAX_COLUMNS:
            ad_channel = ad_channels.get(floor_number)
            floor_number += 1
            if ad_channel:
                items.append({
                    'type': 'advert',
                    'channel': ad_channel,
                })
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
                else:
                    image = None

                headline_size = 'xl'
                headline = story.headline
                for length, size in HEADLINE_SIZES:
                    if len(headline) < length:
                        headline_size = size
                        break
                # logger.debug('{} {}'.format(headline, headline_size))

                item = {
                    'type': 'story',
                    'css_width': 'cols-{}'.format(columns),
                    'css_height': 'rows-{}'.format(floorheight),
                    'headline_class': 'headline-{size}'.format(
                        size=headline_size),
                    'image_size': '{width:.0f}x{height:.0f}'.format(
                        width=PIX_C * columns,
                        height=MIN_H + PIX_H * floorheight,
                    ),
                    'image': image,
                    'story': story,
                    'url': story.url,
                    'alt': story.headline,
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


@anonymous_cache(60 * 3)
def frontpage_view(request, stories=None, frontpage=None):
    """ Shows the newspaper frontpage. """
    context = {}
    if stories is None:
        stories = Story.objects.published()

    blocks = get_frontpage_stories(stories).order_by('-position')[:40]

    context['frontpage_items'] = frontpage_layout(blocks)

    return render(request, 'frontpage.html', context)


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
            return HttpResponseRedirect(story.get_absolute_url())
        except (ValueError, Story.DoesNotExist):
            raise Http404


def storytype_frontpage(request, section, storytype):
    try:
        story_type = StoryType.objects.get(slug=storytype)
    except StoryType.DoesNotExist:
        raise Http404('No such section and story type')
    stories = Story.objects.filter(story_type=story_type).published()
    return frontpage_view(request, stories=stories)
