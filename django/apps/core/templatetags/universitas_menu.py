""" Top megamenu for Universitas """

import logging
from django import template
from apps.stories.models import Section, Story
from apps.issues.models import PrintIssue

register = template.Library()
logger = logging.getLogger(__name__)


# @register.inclusion_tag('universitas-menu.html')
@register.inclusion_tag('old-menu.html', takes_context=True)
def universitas_menu(context, active_section):

    sections = [
        Section.objects.get(title__iexact=title) for title in [
            'nyheter',
            'kultur',
            'debatt',
            'magasin',
        ]
    ]

    latest_pdf = PrintIssue.objects.exclude(pdf=None).order_by(
        'issue__publication_date', 'pk').last()

    return {
        'sections': sections,
        'active_section': active_section,
        'latest_pdf': latest_pdf,
        'staff': context['staff'],
        'office': context['office'],
    }


@register.inclusion_tag('top-stories.html')
def top_stories(section, number, order_by):
    stories = Story.objects.published().filter(
        story_type__section=section
    ).order_by(order_by)[:number]

    context = {
        "stories": stories,
    }
    return context
