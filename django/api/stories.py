import logging

from apps.stories.models import Byline, Story, StoryImage, StoryType
from django.core.exceptions import FieldError
from rest_framework import filters, serializers, viewsets
from url_filter.integrations.drf import DjangoFilterBackend
from utils.serializers import AbsoluteURLField

logger = logging.getLogger('apps')


class StoryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryImage
        fields = [
            'imagefile',
            'caption',
            'creditline',
        ]


class BylineSerializer(serializers.ModelSerializer):

    name = serializers.StringRelatedField(source='contributor')

    class Meta:
        model = Byline
        fields = [
            'credit',
            'name',
            'title',
            'contributor',
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


class StorySerializer(serializers.HyperlinkedModelSerializer):
    """ModelSerializer for Story"""

    class Meta:
        model = Story
        fields = [
            'id',
            'url',
            'public_url',
            'edit_url',
            'modified',
            'created',
            'working_title',
            'publication_status',
            'bodytext_markup',
            'story_type',
            'story_type_name',
            'byline_set',
            'images',
        ]

    byline_set = BylineSerializer(many=True, read_only=True)
    images = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    story_type = serializers.PrimaryKeyRelatedField(
        queryset=StoryType.objects.all(), read_only=False
    )
    story_type_name = serializers.StringRelatedField(source='story_type')
    public_url = AbsoluteURLField(source='get_absolute_url')
    edit_url = AbsoluteURLField(source='get_edit_url')
    bodytext_markup = serializers.CharField(trim_whitespace=False)
    working_title = serializers.CharField(trim_whitespace=False)

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

    queryset = StoryType.objects.all().prefetch_related(
        'section',
    ).order_by('name')
    serializer_class = StoryTypeSerializer


class SearchFilterBackend(filters.BaseFilterBackend):
    """ Postgresql filter """

    def filter_queryset(self, request, queryset, view):
        search_query = request.query_params.get('search', None)
        if search_query:
            qs = queryset.search(search_query)
            if qs:
                queryset = qs
            else:
                queryset = queryset.filter(
                    working_title__icontains=search_query
                )

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
    queryset = Story.objects.all().prefetch_related(
        'story_type__section',
        'bylines',
        'byline_set',
    )
