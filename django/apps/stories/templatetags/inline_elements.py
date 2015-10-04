""" Template tags for inline story elements such as images, asides and pullquotes """

import logging
from django import template

register = template.Library()
logger = logging.getLogger(__name__)


@register.inclusion_tag('_header_images.html', takes_context=True)
def header_image(context):
    story = context['story']
    images = story.images().top()
    videos = story.videos().top()
    height, width = 600, 1200
    # images = context['story'].images().top()
    context = {
        'elements': [i.child for i in images] + [i.child for i in videos],
        'css_classes': 'main_image',
    }
    images = context['elements']

    if images:
        first_image = images[0]
        height = first_image.get_height(width, height)

    if len(context['elements']) > 1:
        context['css_classes'] += ' slideshow'
    context['img_size'] = '{}x{}'.format(width, height)
    return context


@register.inclusion_tag('_inline_images.html', takes_context=True)
def inline_storyimage(context, argument_string):
    story = context['story']
    if '<' in argument_string or '>' in argument_string:
        height, width = 400, 300
    else:
        height, width = 700, 1200
    images = story.images().inline()
    # videos = story.videos().inline()
    context = get_items(images, argument_string)
    # context['elements'] += [i.child for i in videos]
    images = context['elements']
    if images:
        first_image = images[0]
        height = first_image.get_height(width, height)
    size = '{}x{}'.format(width, height)
    if len(images) > 1:
        context['slideshow'] = True
    context['img_size'] = size
    return context


@register.inclusion_tag('_inline_pullquotes.html', takes_context=True)
def inline_pullquote(context, argument_string):
    queryset = context['story'].pullquotes().published()
    return get_items(queryset, argument_string)


@register.inclusion_tag('_inline_videos.html', takes_context=True)
def inline_storyvideo(context, argument_string):
    queryset = context['story'].videos().published()
    return get_items(queryset, argument_string)


@register.inclusion_tag('_inline_asides.html', takes_context=True)
def inline_aside(context, argument_string):
    queryset = context['story'].asides().published()
    context.update(get_items(queryset, argument_string))
    return context


@register.inclusion_tag('_inline_html.html', takes_context=True)
def inline_inlinehtml(context, argument_string):
    queryset = context['story'].inline_html_blocks().published()
    context.update(get_items(queryset, argument_string))
    return context


def get_items(queryset, argument_string):
    """ Turn arguments into classes and items from the queryset """
    FLAGS = {
        '<': 'inline-left',
        '>': 'inline-right',
        '=': 'inline-full',
    }

    context = {'elements': [], 'css_classes': ''}
    indexes, classes = [], []

    arguments = argument_string.split()

    for arg in arguments:
        if arg.isdigit():
            indexes.append(int(arg))
        elif arg in FLAGS:
            classes.append(FLAGS[arg])
        else:
            error_message = 'Unknown argument: {} in {}'.format(
                arg,
                argument_string)
            logger.warn(error_message)
            # raise template.TemplateSyntaxError(error_message)

    for index in indexes:
        context['elements'].extend(
            [i.child for i in queryset.filter(index=index)])

    # context['css_classes'] = ' '.join(classes) or FLAGS['=']
    context['css_classes'] = ' '.join(classes) or 'inline-regular'
    return context
