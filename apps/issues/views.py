# -*- coding: utf-8 -*-
"""
    Issues views
"""

from django.views.generic.base import TemplateView
from django.utils import timezone
from .models import Issue
# from django.conf import settings


class PdfArchiveView(TemplateView):

    """ PDF archive """

    template_name = 'pdf-archive.html'

    def get_queryset(self):
        queryset = Issue.objects.published()
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['issue_list'] = self.get_queryset()
        return context


class PubPlanView(TemplateView):

    """ Publication plan """

    template_name = 'publication-plan.html'

    def get_queryset(self):
        try:
            self.year = int(self.kwargs['year'])
        except KeyError:
            self.year = timezone.now().year

        queryset = Issue.objects.filter(publication_date__year=self.year)

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['issue_list'] = self.get_queryset().reverse()
        context['year'] = self.year
        return context
