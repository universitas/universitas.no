"""Frontpage views"""
import logging
from functools import wraps

from apps.frontpage.models import FrontpageStory
from apps.stories.models import Section, Story, StoryType
from django.http import Http404  # HttpResponsePermanentRedirect,
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.utils.decorators import available_attrs
from django.utils.http import base36_to_int
from django.views.decorators.cache import cache_page

logger = logging.getLogger(__name__)

# from django.contrib.auth.decorators import login_required


def anonymous_cache(timeout):
    def decorator(view_func):
        @wraps(view_func, assigned=available_attrs(view_func))
        def _wrapped_view(request, *args, **kwargs):

            if request.user.is_authenticated:
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
        if block.columns * 2 + columns_used > MAX_COLUMNS:
            ad_channel = ad_channels.get(floor_number)
            floor_number += 1
            if ad_channel:
                items.append({
                    'type': 'advert',
                    'channel': ad_channel,
                })
            # floor is filled. Finish it.
            floorheight = max(item.rows for item in floor)
            ratio = MAX_COLUMNS / columns_used + 0.1
            columns_used = 0
            for story in floor:
                columns = round(story.columns * ratio * 2)
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
                        size=headline_size
                    ),
                    'image_size': '{width:.0f}x{height:.0f}'.format(
                        width=PIX_C * columns,
                        height=MIN_H + PIX_H * floorheight,
                    ),
                    'image': image,
                    'story': story,
                    'url': story.url,
                    'alt': story.headline,
                }
                items.append(item)
            floor = []
            columns_used = 0

        floor.append(block)
        columns_used += block.columns * 2
    return items


def get_frontpage_stories(stories, num=40):
    """ Find frontpage stories connected to queryset """
    qs = FrontpageStory.objects.published().prefetch_related(
        'imagefile',
        'story__story_type__section',
    ).order_by('-order')
    if stories:
        qs = qs.filter(story__in=stories)
    return qs[:num]


@anonymous_cache(60 * 3)
def frontpage_view(request, stories=None, frontpage=None):
    """ Shows the newspaper frontpage. """
    context = {}
    frontpage_stories = get_frontpage_stories(stories)
    context['frontpage_items'] = frontpage_layout(frontpage_stories)

    return render(request, 'frontpage.html', context)


def section_frontpage(request, section):
    try:
        # is the slug a section name?
        section = Section.objects.get(slug=section)
        stories = Story.objects.published().filter(story_type__section=section)
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
    stories = Story.objects.published().filter(story_type=story_type)
    return frontpage_view(request, stories=stories)
