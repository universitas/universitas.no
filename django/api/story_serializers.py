from apps.stories.models import Story, Byline
from rest_framework import serializers, viewsets
from rest_framework.filters import SearchFilter
from url_filter.integrations.drf import DjangoFilterBackend
from django.core.exceptions import FieldError


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
            'byline_set',
        ]

    story_type = serializers.StringRelatedField()
    public_url = serializers.SerializerMethodField()
    edit_url = serializers.SerializerMethodField()

    def _build_uri(self, url):
        return self._context['request'].build_absolute_uri(url)

    def get_public_url(self, instance):
        return self._build_uri(instance.get_absolute_url())

    def get_edit_url(self, instance):
        return self._build_uri(instance.get_edit_url())

    def update(self, instance, validated_data):
        clean_model = (
            validated_data.pop('clean', False) or
            'publication_status' in validated_data
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


class StoryViewSet(QueryOrderableViewSetMixin, viewsets.ModelViewSet):

    """ API endpoint that allows Story to be viewed or updated.  """

    filter_backends = [DjangoFilterBackend, SearchFilter]
    filter_fields = ['id', 'publication_status', 'modified']
    search_fields = ['working_title', 'bodytext_markup']
    queryset = Story.objects.all()
    serializer_class = StorySerializer
