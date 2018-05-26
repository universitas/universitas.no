"""Site data misc"""

from rest_framework import views, response, permissions, serializers

from apps.contributors.models import Contributor
from apps.stories.models import Section, StoryType
from apps.issues.models import Issue
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from utils.serializers import AbsoluteURLField

from .issues import IssueSerializer


class StoryTypeSerializer(serializers.ModelSerializer):
    url = AbsoluteURLField(source='get_absolute_url')

    class Meta:
        model = StoryType
        fields = 'name', 'url', 'count'


class SectionSerializer(serializers.ModelSerializer):
    url = AbsoluteURLField(source='get_absolute_url')
    storytype_set = StoryTypeSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = ['title', 'url', 'storytype_set']


class StaffSerializer(serializers.ModelSerializer):
    thumb = serializers.ImageField(
        source='byline_photo.preview', read_only=True
    )

    class Meta:
        model = Contributor
        fields = [
            'position',
            'display_name',
            'phone',
            'email',
            'thumb',
        ]


class SiteData:
    def __init__(self):
        self.staff = Contributor.objects.management().prefetch_related(
            'byline_photo',
        )
        self.sections = Section.objects.all().prefetch_related(
            'storytype_set',
        )
        issues = Issue.objects.prefetch_related('pdfs')
        self.issues = {
            'latest': issues.latest_issue(),
            'next': issues.next_issue(),
        }


class SiteSerializer(serializers.Serializer):
    staff = StaffSerializer(many=True, read_only=True)
    issues = serializers.DictField(child=IssueSerializer())
    sections = SectionSerializer(many=True, read_only=False)


class SiteDataAPIView(views.APIView):
    """Get basic data about site and staff."""
    permission_classes = [permissions.AllowAny]

    @method_decorator(cache_page(60))
    def get(self, request, format=None):
        serializer = SiteSerializer(SiteData(), context={'request': request})
        return response.Response(serializer.data)
