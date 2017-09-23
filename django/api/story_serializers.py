from apps.stories.models import Byline, Story, StoryType
from django.core.exceptions import FieldError
from rest_framework import serializers, viewsets
from rest_framework.filters import SearchFilter
from url_filter.integrations.drf import DjangoFilterBackend


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

    byline_set = BylineSerializer(
        many=True,
        read_only=True,
    )

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
        ]

    story_type = serializers.PrimaryKeyRelatedField(
        queryset=StoryType.objects.all(),
        read_only=False,
    )
    story_type_name = serializers.StringRelatedField(source='story_type')
    public_url = serializers.SerializerMethodField()
    edit_url = serializers.SerializerMethodField()
    bodytext_markup = serializers.CharField(trim_whitespace=False)
    working_title = serializers.CharField(trim_whitespace=False)

    def _build_uri(self, url):
        return self._context['request'].build_absolute_uri(url)

    def get_public_url(self, instance):
        return self._build_uri(instance.get_absolute_url())

    def get_edit_url(self, instance):
        return self._build_uri(instance.get_edit_url())

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

    queryset = StoryType.objects.all().prefetch_related('section')
    serializer_class = StoryTypeSerializer


class StoryViewSet(QueryOrderableViewSetMixin, viewsets.ModelViewSet):
    """ API endpoint that allows Story to be viewed or updated.  """

    filter_backends = [DjangoFilterBackend, SearchFilter]
    filter_fields = ['id', 'publication_status', 'modified']
    search_fields = ['working_title', 'bodytext_markup']
    queryset = Story.objects.all()
    queryset = queryset.prefetch_related('story_type__section')
    queryset = queryset.prefetch_related('bylines', 'byline_set')
    serializer_class = StorySerializer
