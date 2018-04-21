from apps.stories.models import StoryImage
from rest_framework import serializers, viewsets
from url_filter.integrations.drf import DjangoFilterBackend


class StoryImageSerializer(serializers.ModelSerializer):
    """ModelSerializer for StoryImage"""

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
            # 'size',
        ]


class StoryImageViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows StoryImage to be viewed or updated.
    """

    queryset = StoryImage.objects.order_by('-modified')
    serializer_class = StoryImageSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['parent_story']
