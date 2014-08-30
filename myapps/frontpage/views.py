from django.shortcuts import render
from myapps.stories.models import Story
from myapps.photo.models import ImageFile
from myapps.frontpage.models import Frontpage, Contentblock
from django.http import HttpResponseRedirect, Http404
from django.shortcuts import get_object_or_404
from django.utils import timezone

from django.contrib.auth.decorators import login_required

@login_required
def frontpage_view(request, frontpage=None):
    """ Shows the newspaper frontpage. """
    max_stories = 30
    max_columns = 12
    pix_c = 80
    pix_h = 130
    if frontpage is None:
        frontpage = Frontpage.objects.root()
    else:
        frontpage = get_object_or_404(Frontpage.published, label=frontpage)
    context = {}
    now = timezone.now()
    blocks = Contentblock.objects.filter(
        frontpage=frontpage,
        # frontpage_story__story__publication_date__lt=now,
    )[:max_stories]

    floor = []
    items = []
    columns_used = 0

    for block in blocks:
        if block.columns + columns_used > max_columns:
            floorheight = max(item.height for item in floor)
            ratio = max_columns / columns_used
            columns_used = 0
            for item in floor:
                columns = round(item.columns * ratio)
                columns_used += columns
                if columns_used > 12:
                    columns = columns + 12 - columns_used
                try:
                    image = item.frontpage_story.image.source_file
                except:
                    image = None

                item = {
                    'columns': columns,
                    'columns_small': (12 if columns > 8 else 6),
                    'height': floorheight * 150 + 200,
                    'image_size': '%sx%s' % (pix_c * columns, pix_h * floorheight,),
                    'image': image,
                    'story': item.frontpage_story,
                }
                items.append(item)
            floor = []
            columns_used = 0

        floor.append(block)
        columns_used += block.columns

    context['frontpage_items'] = items

    return render(request, 'frontpage.html', context)
