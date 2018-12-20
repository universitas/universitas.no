from rest_framework import serializers, viewsets
from url_filter.integrations.drf import DjangoFilterBackend

from apps.stories.models import StoryImage
from utils.serializers import AbsoluteURLField, CropBoxField


class StoryImageSerializer(serializers.ModelSerializer):
    """ModelSerializer for StoryImage"""

    filename = serializers.CharField(
        read_only=True, source='imagefile.filename'
    )

    thumb = AbsoluteURLField(source='imagefile.large.url')
    cropped = AbsoluteURLField(read_only=True)
    aspect_ratio = serializers.DecimalField(
        required=False, max_digits=5, decimal_places=4
    )
    crop_box = CropBoxField(source='imagefile.crop_box')

    class Meta:
        model = StoryImage
        fields = [
            'url',
            'id',
            'caption',
            'parent_story',
            'imagefile',
            'creditline',
            'thumb',
            'cropped',
            'filename',
            'ordering',
            'placement',
            'size',
            'aspect_ratio',
            'crop_box',
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
