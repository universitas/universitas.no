from collections import OrderedDict

from apps.frontpage.models import FrontpageStory
from rest_framework import pagination, serializers, viewsets
from rest_framework.response import Response
from rest_framework.utils.urls import replace_query_param
from utils.serializers import AbsoluteURLField


class FrontpageStorySerializer(serializers.ModelSerializer):
    """ModelSerializer for FrontpageStory"""

    story_url = AbsoluteURLField(source='url')
    image = AbsoluteURLField(source='imagefile.small.url')

    class Meta:
        model = FrontpageStory
        fields = [
            'id',
            'headline',
            'kicker',
            'vignette',
            'lede',
            'html_class',
            'columns',
            'rows',
            'order',
            'published',
            'story_url',
            'image',
        ]


class FrontpagePaginator(pagination.LimitOffsetPagination):
    default_limit = 10

    def get_paginated_response(self, data):
        return Response(
            OrderedDict([('count', self.count),
                         ('next', self.get_next_link(data)),
                         ('results', data)])
        )

    def get_next_link(self, data=None):
        if not data:
            return None

        url = self.request.build_absolute_uri()
        url = replace_query_param(url, self.limit_query_param, self.limit)

        offset = data[-1]['order']
        return replace_query_param(url, self.offset_query_param, offset)

    def paginate_queryset(self, queryset, request, view=None):
        self.count = queryset.count()
        self.limit = self.get_limit(request)
        if self.limit is None:
            return None

        self.offset = self.get_offset(request)
        self.request = request
        if self.count > self.limit and self.template is not None:
            self.display_page_controls = True

        return list(queryset.filter(order__lt=self.offset)[:self.limit])


class FrontpageStoryViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows FrontpageStory to be viewed or updated.
    """

    queryset = FrontpageStory.objects.order_by('-order')
    serializer_class = FrontpageStorySerializer
    pagination_class = FrontpagePaginator
