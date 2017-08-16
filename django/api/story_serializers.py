from apps.stories.models import Story, Byline
from rest_framework import serializers, viewsets
from url_filter.integrations.drf import DjangoFilterBackend


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
            'title',
            'public_url',
            'publication_status',
            'bodytext_markup',
            'byline_set',
        ]

    public_url = serializers.SerializerMethodField()

    def _build_uri(self, url):
        return self._context['request'].build_absolute_uri(url)

    def get_public_url(self, instance):
        return self._build_uri(instance.get_absolute_url())


class StoryViewSet(viewsets.ModelViewSet):

    """
    API endpoint that allows Story to be viewed or updated.
    """

    filter_backends = [DjangoFilterBackend]
    filter_fields = ['id', 'publication_status']
    queryset = Story.objects.all()
    serializer_class = StorySerializer
