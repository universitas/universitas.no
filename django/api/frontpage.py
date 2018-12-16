from collections import OrderedDict

from django.db.models import Case, Q, When

from apps.frontpage.models import FrontpageStory
from apps.stories.models import Story
from rest_framework import pagination, serializers, viewsets
from rest_framework.response import Response
from rest_framework.utils.urls import replace_query_param
from utils.serializers import CropBoxField

from .photos import ImageFile, ImageFileSerializer


def size_validator(value):
    columns, rows = value
    if columns not in [2, 3, 4, 6]:
        raise serializers.ValidationError('Incorrect column size')
    if rows not in [1, 2, 3, 4, 5, 6]:
        raise serializers.ValidationError('Incorrect row size')


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


class NestedPhotoSerializer(ImageFileSerializer):
    class Meta(ImageFileSerializer.Meta):
        fields = [
            'id',
            'large',
            'width',
            'height',
        ]


class FrontpageStorySerializer(serializers.ModelSerializer):
    """ModelSerializer for FrontpageStory"""

    imagefile = NestedPhotoSerializer()
    image_id = serializers.PrimaryKeyRelatedField(
        source='imagefile',
        allow_null=True,
        queryset=ImageFile.objects.all(),
        read_only=False,
    )
    section = serializers.IntegerField(
        read_only=True, source='story.story_type.section.pk'
    )
    crop_box = CropBoxField()
    story = NestedStorySerializer(read_only=True)
    language = serializers.SerializerMethodField()
    ranking = serializers.SerializerMethodField()
    baserank = serializers.SerializerMethodField()
    size = serializers.ListField(
        read_only=False,
        min_length=2,
        max_length=2,
        child=serializers.IntegerField(min_value=1, max_value=10),
        validators=[size_validator],
    )

    def get_ranking(self, instance):
        return instance.ranking

    def get_baserank(self, instance):
        return instance.baserank

    def get_language(self, instance):
        if instance.story.language == 'en':
            return 'eng'
        else:
            return 'nor'

    class Meta:
        model = FrontpageStory
        fields = [
            'id',
            'url',
            'imagefile',
            'image_id',
            'crop_box',
            'headline',
            'kicker',
            'vignette',
            'lede',
            'html_class',
            'size',
            'published',
            'section',
            'language',
            'story',
            'priority',
            'ranking',
            'baserank',
        ]


class FrontpagePaginator(pagination.LimitOffsetPagination):
    default_limit = 20

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

        offset = data[-1]['ranking']
        return replace_query_param(url, self.offset_query_param, offset)

    def paginate_queryset(self, queryset, request, view=None):
        self.count = queryset.count()
        self.limit = self.get_limit(request)
        if self.limit is None:
            return None

        self.offset = self.get_offset(request)
        self.request = request

        if self.offset:
            queryset = queryset.filter(ranking__lt=self.offset)
        return list(queryset[:self.limit])


class FrontpageStoryViewset(viewsets.ModelViewSet):
    """ Frontpage news feed. """

    queryset = FrontpageStory.objects.prefetch_related(
        'imagefile', 'story', 'story__story_type__section'
    ).with_ranking()
    serializer_class = FrontpageStorySerializer
    pagination_class = FrontpagePaginator

    def get_queryset(self):
        params = self.request.query_params
        stories = Story.objects.published().exclude(frontpagestory=None)
        language = params.get('language')
        sections = [int(s) for s in params.get('section', '').split(',') if s]
        search = params.get('search')

        if language == 'eng':
            stories = stories.filter(language='en')
        if language == 'nor':
            stories = stories.exclude(language='en')
        if sections:
            stories = stories.filter(story_type__section__in=sections)
        if search:
            stories = stories.search(search)
            pks = list(stories.values_list('frontpagestory', flat=True)[:100])
            order = Case(
                *[When(pk=pk, then=pos) for pos, pk in enumerate(pks)]
            )
            return self.queryset.filter(pk__in=pks).order_by(order)
        else:
            return self.queryset.filter(story__in=stories)
