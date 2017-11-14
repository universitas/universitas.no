""" Issues views """

from django.utils import timezone
from django.views.generic.base import TemplateView

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

    def get_year(self):
        try:
            return int(self.kwargs['year'])
        except KeyError:
            return timezone.now().year

    def get_queryset(self, year=None):
        if year is None:
            year = self.get_year()
        return Issue.objects.filter(publication_date__year=year)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        year = self.get_year()
        context.update({
            'year': year,
            'issue_list': self.get_queryset(year).reverse(),
            'last': year - 1 if self.get_queryset(year - 1).exists() else None,
            'next': year + 1 if self.get_queryset(year + 1).exists() else None,
        })
        return context
