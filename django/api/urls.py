from django.conf.urls import include, url
from rest_auth import urls as rest_auth_urls
from rest_framework import routers

from .contributor_serializers import ContributorViewSet
from .issue_serializers import IssueViewSet, PrintIssueViewSet
from .legacy_serializers import ProdStoryViewSet
from .photo_serializers import ImageFileViewSet
from .story_serializers import StoryTypeViewSet, StoryViewSet

router = routers.DefaultRouter()
router.register(r'images', ImageFileViewSet)
router.register(r'issues', IssueViewSet)
router.register(r'pdfs', PrintIssueViewSet)
router.register(r'contributors', ContributorViewSet)
router.register(r'stories', StoryViewSet, 'story')
router.register(r'storytypes', StoryTypeViewSet)
router.register(r'legacy', ProdStoryViewSet, 'legacy')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(
        r'^api-auth/',
        include('rest_framework.urls', namespace='rest_framework')
    ),
    url(r'^rest-auth/', include(rest_auth_urls)),
]
