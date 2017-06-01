from django.conf.urls import url, include
from rest_framework import routers
from .photo_serializers import ImageFileViewSet
from .issue_serializers import IssueViewSet, PrintIssueViewSet
from .contributor_serializers import ContributorViewSet

router = routers.DefaultRouter()
router.register(r'images', ImageFileViewSet)
router.register(r'issues', IssueViewSet)
router.register(r'pdfs', PrintIssueViewSet)
router.register(r'contributors', ContributorViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='rest_framework'))
]
