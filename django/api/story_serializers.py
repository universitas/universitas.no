from apps.stories.models import Story, Byline
from rest_framework import serializers, viewsets
from url_filter.integrations.drf import DjangoFilterBackend
from django.core.exceptions import FieldError


class BylineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Byline
        fields = [
            'contributor',
            'credit',
            'title',
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
            'modified',
            'created',
            'working_title',
            'public_url',
            'publication_status',
            'bodytext_markup',
            'byline_set',
            'edit_url',
        ]

    public_url = serializers.SerializerMethodField()
    edit_url = serializers.SerializerMethodField()

    def _build_uri(self, url):
        return self._context['request'].build_absolute_uri(url)

    def get_public_url(self, instance):
        return self._build_uri(instance.get_absolute_url())

    def get_edit_url(self, instance):
        return self._build_uri(instance.get_edit_url())

    def update(self, instance, validated_data):
        clean_model = validated_data.pop('clean', False)
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

    """
    API endpoint that allows Story to be viewed or updated.
    """

    filter_backends = [DjangoFilterBackend]
    filter_fields = ['id', 'publication_status', 'modified']
    queryset = Story.objects.all()
    serializer_class = StorySerializer
