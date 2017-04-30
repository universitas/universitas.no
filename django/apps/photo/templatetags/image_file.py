""" Template tag for cropped ImageFile using sorl thumbnail """

from django import template
from sorl import thumbnail
register = template.Library()


@register.inclusion_tag('_image_file.html')
def image_file(image_file, width=300, height=None):
    thumb = thumbnail.get_thumbnail(
        image_file.source_file,
        f'{width}x{height}' if height else f'{width}',
        crop_box=image_file.get_crop_box(),
    )
    return {
        "src": thumb.url,
        "pk": image_file.pk,
        "alt": str(image_file),
    }
