from apps.frontpage.models import FrontpageStory
from rest_framework import serializers, viewsets
from utils.serializers import AbsoluteURLField


class FrontpageStorySerializer(serializers.ModelSerializer):
    """ModelSerializer for FrontpageStory"""

    story_url = AbsoluteURLField(source='url')
    image = AbsoluteURLField(source='imagefile.small.url')

    class Meta:
        model = FrontpageStory
        fields = [
            'id',
            'headline',
            'kicker',
            'vignette',
            'lede',
            'html_class',
            'columns',
            'rows',
            'order',
            'published',
            'story_url',
            'image',
        ]


class FrontpageStoryViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows FrontpageStory to be viewed or updated.
    """

    queryset = FrontpageStory.objects.all()
    serializer_class = FrontpageStorySerializer
