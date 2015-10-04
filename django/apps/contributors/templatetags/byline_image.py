""" Template tags for inline story elements such as images, asides and pullquotes """

import logging
from django import template

register = template.Library()
logger = logging.getLogger(__name__)
DEFAULT_SIZE = "300x300"

@register.inclusion_tag('_byline_image.html')
def byline_image(contributor, image_size=None):
    if image_size is None:
        image_size = DEFAULT_SIZE

    context = {'image_size': image_size, 'contributor': contributor}
    return context

