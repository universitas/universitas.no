""" Views that are only used for development.  """
from django.views.generic.base import TemplateView
# from apps.photo.models import ImageFile


class ReactDevView(TemplateView):
    template_name = 'react.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['images'] = []
        return context
