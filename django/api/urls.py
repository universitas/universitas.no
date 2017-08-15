from django.conf.urls import url, include
from rest_framework import routers
from .photo_serializers import ImageFileViewSet
from .issue_serializers import IssueViewSet, PrintIssueViewSet
from .contributor_serializers import ContributorViewSet
from .story_serializers import StoryViewSet

router = routers.DefaultRouter()
router.register(r'images', ImageFileViewSet)
router.register(r'issues', IssueViewSet)
router.register(r'pdfs', PrintIssueViewSet)
router.register(r'contributors', ContributorViewSet)
router.register(r'stories', StoryViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='rest_framework'))
]
