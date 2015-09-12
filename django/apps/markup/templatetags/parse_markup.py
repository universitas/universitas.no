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
        replace = r'<span class="{}">\1{}</span>'.format(html_class, '' if strip else marker)
        value = re.sub(find, replace, value, re.M)
    return mark_safe(value)


@register.filter('tingo')
def insert_tingo(value, marker=':'):
    """ tingo filter """
    html_class = 'inngangsord'
    find = r'^(.{10}\S*)'
    replace = r'<span class="{0}">\1{0}</span>'.format(html_class)
    value = re.sub(find, replace, value, re.M)
    return mark_safe(value)