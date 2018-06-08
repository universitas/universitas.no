from collections import OrderedDict

from apps.frontpage.models import FrontpageStory
from apps.stories.models import Story
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
    language = serializers.SerializerMethodField()

    def get_language(self, instance):
        if instance.story.language == 'en':
            return 'eng'
        else:
            return 'nor'

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
            'language',
        ]


class FrontpagePaginator(pagination.LimitOffsetPagination):
    default_limit = 15

    def get_paginated_response(self, data):
        return Response(
            OrderedDict([('count', self.count),
                         ('next', self.get_next_link(data)),
                         ('results', data)])
        )

    def get_next_link(self, data=[]):
        if len(data) < self.limit:
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

    queryset = FrontpageStory.objects.published(
    ).order_by('-order').prefetch_related(
        'imagefile', 'story__story_type__section'
    )
    serializer_class = FrontpageStorySerializer
    pagination_class = FrontpagePaginator

    def get_queryset(self):
        """Sort by section"""
        qs = super().get_queryset()
        params = self.request.query_params
        section = params.get('section')
        language = params.get('language')
        search = params.get('search')
        if section:
            sections = [int(s) for s in section.split(',')]
            qs = qs.filter(story__story_type__section__in=sections)
        if language:
            if language == 'eng':
                qs = qs.filter(story__language='en')
            elif language == 'nor':
                qs = qs.exclude(story__language='en')

        if search:
            stories = Story.objects.published().search(search)
            pks = stories.values_list('frontpagestory', flat=True)
            return qs.filter(pk__in=pks)

        return qs
