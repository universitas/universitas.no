import json
import logging

from django import template
from django.utils.safestring import mark_safe

register = template.Library()
logger = logging.getLogger(__name__)


@register.inclusion_tag('_facebook_sdk.html', takes_context=True)
def facebook_sdk(context):
    story = context['story']
    lang = {'nb': 'nb_NO', 'nn': 'nn_NO', 'en': 'en_GB'}.get(story.language)
    fb_init = dict(
        app_id='1936304073248701',
        version='v2.11',
        autoLogAppEvents=True,
        xfbml=True,
    )
    return {
        'init': mark_safe(json.dumps(fb_init)),
        'src': f"https://connect.facebook.net/{lang}/sdk.js",
    }


@register.inclusion_tag('_facebook_comments.html', takes_context=True)
def facebook_comments(context):
    return {'href': context['request'].build_absolute_uri()}
