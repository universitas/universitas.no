import logging

from django.core.exceptions import FieldError
from django.db.models import Count, Prefetch

from apps.stories.models import (
    Aside,
    Byline,
    InlineHtml,
    InlineLink,
    Pullquote,
    Story,
    StoryImage,
    StoryType,
    StoryVideo,
)
from rest_framework import filters, serializers, viewsets
from url_filter.integrations.drf import DjangoFilterBackend
from utils.serializers import AbsoluteURLField

from .storyimages import StoryImageSerializer

logger = logging.getLogger('apps')

child_fields = ['id', 'placement', 'ordering']


class InlineHtmlSerializer(serializers.ModelSerializer):
    """ModelSerializer for InlineHtml"""

    class Meta:
        model = InlineHtml
        fields = [*child_fields, 'bodytext_html']


class PullquoteSerializer(serializers.ModelSerializer):
    """ModelSerializer for Pullquote"""

    class Meta:
        model = Pullquote
        fields = [*child_fields, 'bodytext_markup']


class AsideSerializer(serializers.ModelSerializer):
    """ModelSerializer for Aside"""

    class Meta:
        model = Aside
        fields = [*child_fields, 'bodytext_markup']


class StoryVideoSerializer(serializers.ModelSerializer):
    """ModelSerializer for StoryVideo"""

    class Meta:
        model = StoryVideo
        fields = [
            *child_fields,
            'caption',
            'creditline',
            'embed',
            'video_host',
            'host_video_id',
        ]


class InlineLinkSerializer(serializers.ModelSerializer):
    """ModelSerializer for InlineLink"""

    class Meta:
        model = InlineLink
        fields = [
            'id',
            'name',
            'linked_story',
            'href',
        ]


class BylineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Byline
        fields = [
            'id',
            'ordering',
            'credit',
            'name',
            'title',
            'contributor',
            'thumb',
        ]

    name = serializers.StringRelatedField(source='contributor')
    thumb = AbsoluteURLField(source='contributor.thumb')


class StoryTypeSerializer(serializers.ModelSerializer):
    """ModelSerializer for StoryType"""

    class Meta:
        model = StoryType
        fields = [
            'id',
            'url',
            'name',
            'section',
        ]

    section = serializers.StringRelatedField()


class StorySerializer(serializers.HyperlinkedModelSerializer):
    """ModelSerializer for Story"""
    url_field_name = 'uri'

    class Meta:
        model = Story
        fields = [
            'id',
            'uri',
            'public_url',
            'edit_url',
            'modified',
            'created',
            'working_title',
            'publication_status',
            'kicker',
            'title',
            'lede',
            'theme_word',
            'bodytext_markup',
            'publication_date',
            'story_type',
            'story_type_name',
            'image_count',
        ]

    story_type_name = serializers.StringRelatedField(source='story_type')
    public_url = AbsoluteURLField(source='get_absolute_url')
    edit_url = AbsoluteURLField(source='get_edit_url')
    bodytext_markup = serializers.CharField(trim_whitespace=False)
    working_title = serializers.CharField(trim_whitespace=False)
    story_type = serializers.PrimaryKeyRelatedField(
        queryset=StoryType.objects.all(), read_only=False
    )
    image_count = serializers.IntegerField(read_only=True)

    # url = serializers.HyperlinkedIdentityField()

    def update(self, instance, validated_data):
        clean_model = (
            validated_data.pop('clean', False)
            or 'publication_status' in validated_data
        )

        story = super().update(instance, validated_data)
        if clean_model:
            story.full_clean()
            story.save()
        return story


class StorySerializerNested(StorySerializer):
    class Meta(StorySerializer.Meta):
        fields = StorySerializer.Meta.fields + [
            'bylines',
            'links',
            'pullquotes',
            'asides',
            'images',
            'videos',
            'inline_html_blocks',
            'language',
            'comment_field',
        ]

    bylines = BylineSerializer(required=False, source='byline_set', many=True)
    pullquotes = PullquoteSerializer(required=False, many=True)
    asides = AsideSerializer(required=False, many=True)
    images = StoryImageSerializer(required=False, many=True)
    inline_html_blocks = InlineHtmlSerializer(required=False, many=True)
    videos = StoryVideoSerializer(required=False, many=True)
    links = InlineLinkSerializer(
        required=False, source='inline_links', many=True
    )


class QueryOrderableViewSetMixin(object):
    def get_queryset(self):
        queryset = super().get_queryset()
        order_by = self.request.query_params.get('order_by', '').split(',')
        if order_by:
            try:
                qs = queryset.order_by(*order_by)
                qs.query.sql_with_params()
                return qs
            except FieldError:
                pass  # invalid sort field
        return queryset


class StoryTypeViewSet(viewsets.ModelViewSet):
    """ API endpoint that allows StoryType to be viewed or updated.  """

    queryset = StoryType.objects.active().prefetch_related(
        'section',
    ).order_by('name')
    serializer_class = StoryTypeSerializer


class SearchFilterBackend(filters.BaseFilterBackend):
    """ Postgresql filter """

    def filter_queryset(self, request, queryset, view):
        search_query = request.query_params.get('search', None)
        if search_query:
            filtered = queryset.search(search_query).values('id')
            queryset = queryset.filter(id__in=filtered)

        order_by = request.query_params.get('ordering')
        if order_by:
            return queryset.order_by(order_by)
        else:
            return queryset.order_by('publication_status', '-modified')


class StoryViewSet(QueryOrderableViewSetMixin, viewsets.ModelViewSet):
    """ API endpoint that allows Story to be viewed or updated.  """

    filter_backends = [DjangoFilterBackend, SearchFilterBackend]
    filter_fields = ['id', 'publication_status', 'modified']

    serializer_class = StorySerializer

    def is_nested(self):
        return 'nested' in self.request.query_params

    def get_queryset(self):
        queryset = Story.objects.select_related('story_type').annotate(
            image_count=Count('images')
        )
        if self.request.user.is_anonymous:
            queryset = queryset.published()
        if self.is_nested():
            return queryset.prefetch_related(
                Prefetch(
                    'byline_set',
                    queryset=Byline.objects.select_related('contributor')
                ),
                Prefetch(
                    'images',
                    queryset=StoryImage.objects.select_related('imagefile')
                ),
                'asides',
                'pullquotes',
                'inline_html_blocks',
                'inline_links',
                'videos',
            )
        return queryset

    def get_serializer_class(self):
        if self.is_nested():
            return StorySerializerNested
        return super().get_serializer_class()
