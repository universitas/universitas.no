from rest_framework import filters, pagination, serializers, viewsets

from apps.stories.models import StoryImage


class StoryImageSerializer(serializers.HyperlinkedModelSerializer):
    """ModelSerializer for StoryImage"""

    class Meta:
        model = StoryImage
        fields = '__all__'


class StoryImageViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows StoryImage to be viewed or updated.
    """

    queryset = StoryImage.objects.all()
    serializer_class = StoryImageSerializer
