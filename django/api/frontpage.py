from collections import OrderedDict

from apps.frontpage.models import FrontpageStory
from apps.stories.models import Story
from django.db.models import Case, Q, When
from rest_framework import pagination, serializers, viewsets
from rest_framework.response import Response
from rest_framework.utils.urls import replace_query_param
from utils.serializers import AbsoluteURLField, CropBoxField


class NestedStorySerializer(serializers.ModelSerializer):
    section = serializers.CharField(source='story_type.section')

    class Meta:
        model = Story
        fields = [
            'id',
            'title',
            'language',
            'section',
        ]


class FrontpageStorySerializer(serializers.ModelSerializer):
    """ModelSerializer for FrontpageStory"""

    image = AbsoluteURLField(source='imagefile.large.url')
    crop_box = CropBoxField(read_only=True, source='imagefile.crop_box')
    section = serializers.IntegerField(
        read_only=True, source='story.story_type.section.pk'
    )
    story = NestedStorySerializer(read_only=True)
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
            'image',
            'crop_box',
            'section',
            'language',
            'story',
        ]


class FrontpagePaginator(pagination.LimitOffsetPagination):
    default_limit = 25

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
        'imagefile', 'story', 'story__story_type__section'
    )
    serializer_class = FrontpageStorySerializer
    pagination_class = FrontpagePaginator

    def _sections(self, qs):
        section = self.request.query_params.get('section')
        if section:
            try:
                sections = map(int, section.split(','))
                qs = qs.filter(story__story_type__section__in=sections)
            except ValueError:
                pass
        return qs

    def _language(self, qs):
        language = self.request.query_params.get('language')
        english = Q(story__language='en')
        if language == 'eng':
            qs = qs.filter(english)
        if language == 'nor':
            qs = qs.exclude(english)
        return qs

    def _search(self, qs):
        search = self.request.query_params.get('search')
        if search:
            stories = Story.objects.published().search(search)
            pks = stories.values_list('frontpagestory', flat=True)
            if pks:
                order = Case(
                    *[When(pk=pk, then=pos) for pos, pk in enumerate(pks)]
                )
                qs = qs.filter(pk__in=pks).order_by(order)
            else:
                qs = qs.none()
        return qs

    def get_queryset(self):
        """Sort by section"""
        return self._search(
            self._language(self._sections(super().get_queryset()))
        )
