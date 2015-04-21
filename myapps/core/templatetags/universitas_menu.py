""" Top megamenu for Universitas """

import logging
from django import template
from myapps.stories.models import Section, Story

register = template.Library()
logger = logging.getLogger('universitas')


@register.inclusion_tag('universitas-menu.html')
def universitas_menu(active_section):

    sections = [
        Section.objects.get(title__iexact=title) for title in [
            'nyheter',
            'kultur',
            'debatt',
            'magasin',
        ]
    ]

    context = {
        'sections': sections,
        'active_section': active_section,
    }
    return context


@register.inclusion_tag('top-stories.html')
def top_stories(section, number, order_by):
    stories = Story.objects.published().filter(
        story_type__section=section
    ).order_by(order_by)[:number]

    context = {
        "stories": stories,
    }
    return context
