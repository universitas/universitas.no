"""Static file loader to use with gulp file revisions"""

from django import template
from django.conf import settings
from django.contrib.staticfiles.storage import staticfiles_storage
from django.templatetags.static import StaticNode
import logging
logger = logging.getLogger(__name__)

register = template.Library()


class FileRevNode(StaticNode):

    """
    Overrides normal static file handling by first checking for file revisions
    in settings.FILEREVS, before falling back to the actual requested filename.
    Otherwise indentical to normal static tag.
    """

    def url(self, context):
        path = self.path.resolve(context)
        revved_path = settings.GULP_FILEREVS.get(path)
        # logger.debug('%s :: %s' % (path, revved_path))
        if revved_path is not None:
            return staticfiles_storage.url(revved_path)
        else:
            return super(FileRevNode, self).url(context)


@register.tag
def static(parser, token):
    """
    Use gulp revision static file names for versioning of js and css etc.
    usage:
    {% load revved_static %}
    <link rel="stylesheet" href="{% static 'css/styles.css' %}">
    """
    return FileRevNode.handle_token(parser, token)
