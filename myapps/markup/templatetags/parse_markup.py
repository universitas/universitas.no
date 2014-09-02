from django import template
import re
from django.utils.safestring import mark_safe

register = template.Library()


@register.filter
def inline_tags(value):
    """ parses inline tags into valid html """
    value = re.sub(r'_([^_]+)_', r'<em>\1</em>', value)
    return mark_safe(value)


@register.filter
def strip_tags(value):
    """ removes all markup tags and returns plain text string """
    value = re.sub(r'_([^_]+)_', r'\1', value)
    return value


@register.filter('caption')
def insert_span_to(value, marker=':'):
    """ creates a span from beginning of input string to marker """
    html_class = 'inngangsord'
    strip = False
    if marker in value:
        find = r'^(.*?){}'.format(marker)
        replace = r'<strong class="{}">\1{}</strong>'.format(html_class, '' if strip else marker)
        value = re.sub(find, replace, value, re.M)
    return mark_safe(value)
