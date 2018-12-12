import logging

from django.db.models import Prefetch
from rest_framework import pagination, serializers, viewsets
from rest_framework.filters import BaseFilterBackend
from url_filter.integrations.drf import DjangoFilterBackend

from apps.stories.models import Byline, Story, StoryImage
from utils.serializers import AbsoluteURLField

from .stories import StorySerializerNested

logger = logging.getLogger('apps')
child_fields = ['id', 'placement', 'ordering']


class PublicStorySerializer(StorySerializerNested):
    """ModelSerializer for public Story"""

    class Meta(StorySerializerNested.Meta):
        model = Story
        fields = StorySerializerNested.Meta.fields + [
            'url',
            'slug',
            'comment_field',
            'fb_image',
            'related_stories',
        ]

    related_stories = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True, source='related_published'
    )
    url = serializers.HyperlinkedIdentityField(view_name='publicstory-detail')
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
