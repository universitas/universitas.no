from django.shortcuts import render
from myapps.stories.models import Story
from myapps.photo.models import ImageFile
from myapps.frontpage.models import Frontpage, StoryModule
from django.http import HttpResponseRedirect, Http404
from django.shortcuts import get_object_or_404
from django.utils import timezone
import logging
logger = logging.getLogger('universitas')

from django.contrib.auth.decorators import login_required


@login_required
def frontpage_view(request, frontpage=None):
    """ Shows the newspaper frontpage. """
    max_stories = 30
    max_columns = 12
    pix_c = 1000 / 12
    pix_h = 100
    min_h = 200
    if frontpage is None:
        frontpage = Frontpage.objects.root()
    else:
        frontpage = get_object_or_404(Frontpage.published, label=frontpage)
    editor = True
    context = {'editor': editor }
    now = timezone.now()
    blocks = StoryModule.objects.filter(
        frontpage=frontpage,
        # frontpage_story__story__publication_date__lt=now,
    )[:max_stories]

    floor = []
    items = []
    columns_used = 0
    headline_sizes = [
        (10, 's'),
        (20, 'm'),
        (30, 'l'),
    ]


    # TODO: Refaktorisere forsideplassering i etasjer - del opp i funksjoner.
    for block in blocks:
        if block.columns + columns_used > max_columns:
            floorheight = max(item.height for item in floor)
            ratio = max_columns / columns_used
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
                for length, size in headline_sizes:
                    if len(headline) < length:
                        headline_size = size
                        break
                logger.debug('{} {}'.format(headline, headline_size))

                item = {
                    'css_width': 'cols-{}'.format(columns),
                    'css_height': 'rows-{}'.format(floorheight),
                    'headline_class': 'headline-{size}'.format(
                        size=headline_size),
                    'image_size': '{width:.0f}x{height:.0f}'.format(
                        width=pix_c * columns,
                        height=min_h + pix_h * floorheight,
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

    context['frontpage_items'] = items

    return render(request, 'frontpage.html', context)
