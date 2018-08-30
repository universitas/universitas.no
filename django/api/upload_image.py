import logging
import re

from rest_framework import mixins, permissions, serializers, viewsets
from rest_framework.parsers import FormParser, MultiPartParser

from apps.contributors.models import Contributor
from apps.photo.models import ImageFile
from django.conf import settings

from .photos import ImageFileSerializer

logger = logging.getLogger('apps')


class UploadFileSerializer(ImageFileSerializer):
    """ImageFile upload serializer"""

    original = serializers.ImageField(required=True)
    artist = serializers.CharField(required=False)
    description = serializers.CharField(required=True)
    duplicates = serializers.CharField(required=False)
    contributor = serializers.PrimaryKeyRelatedField(
        queryset=Contributor.objects.all()
    )

    class Meta:
        model = ImageFile
        fields = [
            'id',
            'url',
            'original',
            'created',
            'description',
            'filename',
            'category',
            'duplicates',
            'contributor',
            'artist',
        ]

    def create(self, validated_data):
        """Create new ImageFile, set contributor and merge any dupliacates."""
        # check if form includes duplicates
        duplicates = validated_data.pop('duplicates', None)
        instance = super().create(validated_data)
        if duplicates:
            pks = [int(pk) for pk in re.findall(r'\d+', duplicates)]
            duplicates = ImageFile.objects.filter(pk__in=pks)
            if duplicates:
                logger.debug(
                    f'found dupes: {", ".join(str(d) for d in duplicates)}'
                )
                instance.merge_with(duplicates)
        return instance


class FileUploadViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    """Endpoint for image uploads"""
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = UploadFileSerializer
    queryset = ImageFile.objects.none()
    if settings.DEBUG:
        permission_classes = [permissions.AllowAny]
