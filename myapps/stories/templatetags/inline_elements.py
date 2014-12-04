from django import template
register = template.Library()

@register.inclusion_tag('_inline_images.html', takes_context=True)
def inline_images(context, index):
    story = context['story']
    images = story.images().published().filter(position_vertical=index)
    context = {'images': [i.child for i in images]}
    return context
