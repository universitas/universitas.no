from django.views.generic.base import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin


class PhotoAppView(LoginRequiredMixin, TemplateView):
    template_name = 'photo_app.html'
