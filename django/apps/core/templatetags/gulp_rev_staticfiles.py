"""Static file loader to use with gulp file revisions"""

from django import template
from django.conf import settings
from django.contrib.staticfiles.storage import staticfiles_storage
from django.contrib.staticfiles.templatetags.staticfiles import StaticFilesNode
import json

register = template.Library()


class FileRevNode(StaticFilesNode):

    """
    Overrides normal static file handling by first checking for file revisions
    in settings.FILEREVS, before falling back to the actual requested filename.
    Otherwise indentical to normal static tag.
    """

    try:
        with open(settings.GULP_FILEREVS_PATH) as filerevs_fh:
            FILEREVS = json.load(filerevs_fh)
    except IOError:
        # No file revisions found, continuing without
        FILEREVS = {}

    def url(self, context):
        path = self.path.resolve(context)
        revved_path = self.FILEREVS.get(path)
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
