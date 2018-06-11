import logging

from apps.stories.models import Byline, Story, StoryImage, StoryType
from django.db.models import Prefetch
from rest_framework import serializers, viewsets
from rest_framework.filters import BaseFilterBackend
from utils.serializers import AbsoluteURLField

from .stories import StorySerializer

logger = logging.getLogger('apps')


class StoryImageSerializer(serializers.ModelSerializer):

    large = AbsoluteURLField()
    cropped = AbsoluteURLField()

    class Meta:
        model = StoryImage
        fields = [
            'imagefile_id',
            'caption',
            'creditline',
            'aspect_ratio',
            'large',
            'cropped',
        ]


class BylineSerializer(serializers.ModelSerializer):

    name = serializers.StringRelatedField(source='contributor')
    thumb = AbsoluteURLField(source='contributor.thumb')

    class Meta:
        model = Byline
        fields = [
            'credit',
            'name',
            'title',
            'contributor',
            'thumb',
        ]


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
            'pullquotes',
            'asides',
            'images',
            'storytype',
            'publication_status',
            'language',
            'comment_field',
            'fb_image',
            'modified',
            'created',
            'publication_date',
        ]

    url = serializers.HyperlinkedIdentityField(view_name='publicstory-detail')
    bylines = BylineSerializer(source='byline_set', many=True, read_only=True)
    images = StoryImageSerializer(many=True, read_only=True)
    storytype = StoryTypeSerializer(read_only=True)
    public_url = AbsoluteURLField(source='get_absolute_url')
    edit_url = AbsoluteURLField(source='get_edit_url')
    bodytext_markup = serializers.CharField(trim_whitespace=False)
    working_title = serializers.CharField(trim_whitespace=False)
    fb_image = AbsoluteURLField(source='facebook_thumb.url')


class MyFilterBackend(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if 'pk' not in view.kwargs:
            return queryset.published()
        return queryset


class PublicStoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ API endpoint that allows Story to be viewed or updated.  """

    serializer_class = PublicStorySerializer
    filter_backends = [MyFilterBackend]
    queryset = Story.objects.prefetch_related(
        'story_type__section',
        'asides',
        'pullquotes',
        'images',
        Prefetch(
            'byline_set',
            queryset=Byline.objects.select_related('contributor')
        ),
    )
