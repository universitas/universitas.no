from rest_framework import serializers, viewsets

from apps.frontpage.models import FrontpageStory


class FrontpageStorySerializer(serializers.ModelSerializer):
    """ModelSerializer for FrontpageStory"""

    class Meta:
        model = FrontpageStory
        fields = '__all__'


class FrontpageStoryViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows FrontpageStory to be viewed or updated.
    """

    queryset = FrontpageStory.objects.all()
    serializer_class = FrontpageStorySerializer
