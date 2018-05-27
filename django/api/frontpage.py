from collections import OrderedDict

from apps.frontpage.models import FrontpageStory
from rest_framework import pagination, serializers, viewsets
from rest_framework.response import Response
from rest_framework.utils.urls import replace_query_param
from utils.serializers import AbsoluteURLField, CropBoxField


class FrontpageStorySerializer(serializers.ModelSerializer):
    """ModelSerializer for FrontpageStory"""

    story_url = AbsoluteURLField(source='url')
    image = AbsoluteURLField(source='imagefile.large.url')
    crop_box = CropBoxField(read_only=True, source='imagefile.crop_box')
    section = serializers.IntegerField(
        read_only=True, source='story.story_type.section.pk'
    )

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
            'crop_box',
            'section',
        ]


class FrontpagePaginator(pagination.LimitOffsetPagination):
    default_limit = 15

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

        if self.offset:
            queryset = queryset.filter(order__lt=self.offset)
        return list(queryset[:self.limit])


class FrontpageStoryViewset(viewsets.ModelViewSet):
    """ Frontpage news feed. """

    queryset = FrontpageStory.objects.order_by('-order').prefetch_related(
        'imagefile', 'story__story_type__section'
    )
    serializer_class = FrontpageStorySerializer
    pagination_class = FrontpagePaginator

    def get_queryset(self):
        """Sort by section"""
        try:
            section = int(self.request.query_params.get('section'))
            return self.queryset.filter(story__story_type__section=section)
        except TypeError:
            return self.queryset
