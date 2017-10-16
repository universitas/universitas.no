""" Views for searching """

from apps.stories.models import Story
from django.shortcuts import redirect
from django.views.generic import ListView


class SearchMixin:
    """Base mixin for search views."""

    context_object_name = "search_results"
    query_param = "q"

    def get_queryset(self):
        """Returns the initial queryset."""
        return Story.objects.published().search(self.query)

    def get_query(self, request):
        """Parses the query from the request."""
        return request.GET.get(self.query_param, "").strip()

    def get_context_data(self, **kwargs):
        """Generates context variables."""
        context = super().get_context_data(**kwargs)
        context["query"] = self.query
        return context

    def get(self, request, *args, **kwargs):
        """Performs a GET request."""
        self.query = self.get_query(request)
        if not self.query:
            empty_query_redirect = self.get_empty_query_redirect()
            if empty_query_redirect:
                return redirect(empty_query_redirect)
        return super().get(request, *args, **kwargs)


class SearchView(SearchMixin, ListView):
    """View that performs a search and returns the search results."""

    paginate_by = 10
    template_name = "search-results.html"
