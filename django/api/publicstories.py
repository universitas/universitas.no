import logging

from rest_framework import serializers, viewsets
from rest_framework.filters import BaseFilterBackend

from apps.stories.models import Byline, Story, StoryImage, StoryType
from django.db.models import Prefetch
from utils.serializers import AbsoluteURLField, CropBoxField

from .stories import StorySerializer

logger = logging.getLogger('apps')


class StoryImageSerializer(serializers.ModelSerializer):

    large = AbsoluteURLField()
    cropped = AbsoluteURLField()
    crop_box = CropBoxField(
        read_only=True,
        source='imagefile.crop_box',
    )

    class Meta:
        model = StoryImage
        fields = [
            'id',
            'top',
            'caption',
            'creditline',
            'aspect_ratio',
            'large',
            'cropped',
            'crop_box',
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
            'ordering',
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
            'pullquotes',
            'asides',
            'images',
            'story_type',
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
    story_type = StoryTypeSerializer(read_only=True)
    public_url = AbsoluteURLField(source='get_absolute_url')
    edit_url = AbsoluteURLField(source='get_edit_url')
    bodytext_markup = serializers.CharField(trim_whitespace=False)
    working_title = serializers.CharField(trim_whitespace=False)
    fb_image = AbsoluteURLField(source='facebook_thumb.url')


class ListPublishedStoriesFilter(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if 'pk' not in view.kwargs:
            return queryset.published().order_by('-pk')
        return queryset


class PublicStoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ API endpoint that allows Story to be viewed or updated.  """

    serializer_class = PublicStorySerializer
    filter_backends = [ListPublishedStoriesFilter]
    queryset = Story.objects.prefetch_related(
        'story_type__section',
        'asides',
        'pullquotes',
        Prefetch(
            'images', queryset=StoryImage.objects.select_related('imagefile')
        ),
        Prefetch(
            'byline_set',
            queryset=Byline.objects.select_related('contributor')
        ),
    )
