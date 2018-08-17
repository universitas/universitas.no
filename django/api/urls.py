from django.conf.urls import include, url
from rest_auth import urls as rest_auth_urls
from rest_framework import routers

from .adverts import AdvertViewSet
from .contributors import ContributorViewSet
from .frontpage import FrontpageStoryViewset
from .issues import IssueViewSet, PrintIssueViewSet
from .legacy_viewsets import ProdStoryViewSet
from .permissions import PermissionViewSet
from .photos import ImageFileViewSet
from .publicstories import PublicStoryViewSet
from .site import SiteDataAPIView
from .stories import StoryTypeViewSet, StoryViewSet
from .storyimages import StoryImageViewSet
from .upload_image import FileUploadViewSet

router = routers.DefaultRouter()

router.register(r'contributors', ContributorViewSet)
router.register(r'frontpage', FrontpageStoryViewset)
router.register(r'photos', ImageFileViewSet)
router.register(r'issues', IssueViewSet)
router.register(r'legacy', ProdStoryViewSet, 'legacy')
router.register(r'pdfs', PrintIssueViewSet)
router.register(r'permissions', PermissionViewSet)
router.register(r'stories', StoryViewSet, 'story')
router.register(r'storyimages', StoryImageViewSet)
router.register(r'storytypes', StoryTypeViewSet)
router.register(r'upload', FileUploadViewSet, 'upload')
router.register(r'publicstories', PublicStoryViewSet, 'publicstory')
router.register(r'adverts', AdvertViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(
        r'^api-auth/',
        include('rest_framework.urls', namespace='rest_framework')
    ),
    url(r'^rest-auth/', include(rest_auth_urls)),
    url(r'^site/$', SiteDataAPIView.as_view(), name='site-data')
]
