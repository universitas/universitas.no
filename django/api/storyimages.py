from rest_framework import serializers, viewsets
from url_filter.integrations.drf import DjangoFilterBackend

from apps.stories.models import StoryImage


class StoryImageSerializer(serializers.ModelSerializer):
    """ModelSerializer for StoryImage"""

    filename = serializers.CharField(
        required=False, source='imagefile.filename'
    )
    small = serializers.SerializerMethodField()

    def _build_uri(self, url):
        return self._context['request'].build_absolute_uri(url)

    def get_small(self, instance):
        try:
            return self._build_uri(instance.imagefile.small.url)
        except Exception as e:
            return str(e)

    class Meta:
        model = StoryImage
        fields = [
            'url',
            'id',
            'caption',
            'parent_story',
            'imagefile',
            'creditline',
            'index',
            'small',
            'filename',
            # 'size',
        ]


class StoryImageViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows StoryImage to be viewed or updated.
    """

    queryset = StoryImage.objects.prefetch_related(
        'imagefile',
    ).order_by(
        '-modified',
    )
    serializer_class = StoryImageSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['parent_story']
