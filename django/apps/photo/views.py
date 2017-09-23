from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.base import TemplateView


class PhotoAppView(LoginRequiredMixin, TemplateView):
    template_name = 'photo_app.html'
