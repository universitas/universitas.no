import logging

from rest_framework import pagination, serializers, viewsets
from rest_framework.filters import BaseFilterBackend
from url_filter.integrations.drf import DjangoFilterBackend

from apps.stories.models import (
    Byline,
    InlineLink,
    Story,
    StoryImage,
    StoryType,
    StoryVideo,
)
from django.db.models import Prefetch
from utils.serializers import AbsoluteURLField, CropBoxField

from .stories import StorySerializer

logger = logging.getLogger('apps')
child_fields = ['id', 'placement', 'ordering']


class StoryImageSerializer(serializers.ModelSerializer):

    large = AbsoluteURLField()
    cropped = AbsoluteURLField()

    crop_box = CropBoxField(
        read_only=True,
        source='imagefile.crop_box',
    )
    category = serializers.CharField(
        read_only=True, source='imagefile.api_category'
    )

    class Meta:
        model = StoryImage
        fields = [
            *child_fields,
            'caption',
            'creditline',
            'aspect_ratio',
            'large',
            'cropped',
            'crop_box',
            'crop_size',
            'category',
        ]


class StoryTypeSerializer(serializers.ModelSerializer):
    """ModelSerializer for StoryType"""

    class Meta:
        model = StoryType
        fields = [
            'id',
            'name',
            'section',
        ]

    section = serializers.StringRelatedField()


class PublicStorySerializer(StorySerializer):
    """ModelSerializer for public Story"""

    class Meta(StorySerializer.Meta):
        model = Story
        fields = [
            'url',
            'id',
            'slug',
            'kicker',
            'title',
            'lede',
            'theme_word',
            'bodytext_markup',
            'bylines',
            'images',
            'videos',
            'pullquotes',
            'asides',
            'inline_html_blocks',
            'links',
            'story_type',
            'publication_status',
            'language',
            'comment_field',
            'fb_image',
            'modified',
            'created',
            'publication_date',
            'related_stories',
        ]

    related_stories = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True, source='related_published'
    )
    url = serializers.HyperlinkedIdentityField(view_name='publicstory-detail')
    images = StoryImageSerializer(many=True)
    story_type = StoryTypeSerializer(read_only=True)
    public_url = AbsoluteURLField(source='get_absolute_url')
    edit_url = AbsoluteURLField(source='get_edit_url')
    bodytext_markup = serializers.CharField(trim_whitespace=False)
    working_title = serializers.CharField(trim_whitespace=False)
    fb_image = AbsoluteURLField(source='facebook_thumb')


class ListPublishedStoriesFilter(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if 'pk' not in view.kwargs:
            return queryset.published().order_by('-pk')
        if request.user.is_anonymous:
            return queryset.published()
        return queryset


class SmallerPageSize(pagination.LimitOffsetPagination):
    default_limit = 10


class PublicStoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ API endpoint for rendering published stories. """

    pagination_class = SmallerPageSize
    serializer_class = PublicStorySerializer
    filter_backends = [DjangoFilterBackend, ListPublishedStoriesFilter]
    filter_fields = ['id']
    queryset = Story.objects.filter(
        publication_status__lte=11
    ).prefetch_related(
        'story_type__section',
        'asides',
        'pullquotes',
        'inline_links',
        'videos',
        'inline_html_blocks',
        'related_stories',
        Prefetch(
            'images', queryset=StoryImage.objects.select_related('imagefile')
        ),
        Prefetch(
            'byline_set',
            queryset=Byline.objects.select_related('contributor')
        ),
    )
