# -*- coding: utf-8 -*-
"""
Views for use with django-watson
"""
from django.views.generic.list import BaseListView
from django.views.generic import ListView
import watson
import json
from django.http import HttpResponse
from django.shortcuts import redirect


class SearchMixin:

    """Base mixin for search views."""

    context_object_name = "search_results"
    query_param = "q"

    def get_queryset(self):
        """Returns the initial queryset."""
        search_results = watson.search.search(self.query)
        if search_results:
            search_results = search_results.prefetch_related("object")

        return search_results

    def get_query(self, request):
        """Parses the query from the request."""
        return request.GET.get(self.query_param, "").strip()

    empty_query_redirect = None

    def get_empty_query_redirect(self):
        """Returns the URL to redirect an empty query to, or None."""
        return self.empty_query_redirect


    def get_context_data(self, **kwargs):
        """Generates context variables."""
        context = super(SearchMixin, self).get_context_data(**kwargs)
        context["query"] = self.query
        return context

    def get(self, request, *args, **kwargs):
        """Performs a GET request."""
        self.query = self.get_query(request)
        if not self.query:
            empty_query_redirect = self.get_empty_query_redirect()
            if empty_query_redirect:
                return redirect(empty_query_redirect)
        return super(SearchMixin, self).get(request, *args, **kwargs)


class SearchView(SearchMixin, ListView):

    """View that performs a search and returns the search results."""

    paginate_by = 10
    template_name = "search-results.html"


class SearchApiView(SearchMixin, BaseListView):

    """A JSON-based search API."""

    def render_to_response(self, context, **response_kwargs):
        """Renders the search results to the response."""
        content = json.dumps({
            "results": [
                {
                    "title": result.title,
                    "description": result.description,
                    "url": result.url,
                    "meta": result.meta,
                } for result in context[
                    self.get_context_object_name(self.get_queryset())
                ]
            ]
        }).encode("utf-8")
        # Generate the response.
        response = HttpResponse(content, **response_kwargs)
        response["Content-Type"] = "application/json; charset=utf-8"
        response["Content-Length"] = len(content)
        return response
