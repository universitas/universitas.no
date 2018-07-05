from django import template
from django.utils.safestring import mark_safe
from webpack_loader import utils

register = template.Library()


@register.simple_tag(takes_context=True)
def render_bundle(
    context, bundle_name, extension=None, config='DEFAULT', attrs=''
):
    tags = utils.get_as_tags(
        bundle_name, extension=extension, config=config, attrs=attrs
    )
    server_name = context['request'].get_host().split(':')[0]
    return mark_safe('\n'.join(tags).replace('localhost', server_name))
