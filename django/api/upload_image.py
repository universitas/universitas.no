import logging
import re

from apps.photo.models import ImageFile
from django.conf import settings
from rest_framework import mixins, permissions, serializers, viewsets
from rest_framework.parsers import FormParser, MultiPartParser

from .photos import ImageFileSerializer

logger = logging.getLogger('apps')


class UploadFileSerializer(ImageFileSerializer):
    """ImageFile upload serializer"""

    original = serializers.ImageField(required=True)
    description = serializers.CharField(required=True)
    duplicates = serializers.CharField(required=False)

    class Meta:
        model = ImageFile
        fields = ImageFileSerializer.Meta.fields[:]
        fields.append('duplicates')
        fields.remove('cropping_method')
        fields.remove('method')
        fields.remove('_imagehash')
        fields.remove('stat')
        fields.remove('contributor')
        fields.remove('crop_box')
        fields.remove('is_profile_image')
        fields.remove('usage')

    def create(self, validated_data):
        """Create new ImageFile, set contributor and merge any dupliacates."""

        # `original` is a property. To save, use underlying `source_file` field
        validated_data['source_file'] = validated_data.pop('original')

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
