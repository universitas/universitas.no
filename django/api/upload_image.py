import logging

from apps.contributors.models import Contributor
from apps.photo.models import ImageFile
from rest_framework import mixins, permissions, response, serializers, viewsets
from rest_framework.parsers import FormParser, MultiPartParser

from .photos import ImageFileSerializer

logger = logging.getLogger('apps')


class UploadFileSerializer(ImageFileSerializer):
    original = serializers.ImageField(required=True)
    description = serializers.CharField(min_length=10, required=True)
    artist = serializers.CharField(min_length=2, required=True)

    class Meta:
        model = ImageFile
        fields = [
            'url',
            'original',
            'description',
            'artist',
            'category',
            'name',
            'small',
            'stat',
            '_imagehash',
        ]
        read_only_fields = [
            'crop_box',
        ]

    def create(self, validated_data):
        artist = validated_data.pop('artist')
        validated_data['source_file'] = validated_data.pop('original')
        try:
            validated_data['contributor'] = Contributor.objects.get(
                display_name=artist
            )
        except Contributor.DoesNotExist:
            validated_data['copyright_information'] = artist
        return super().create(validated_data)


class FileUploadViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    """Endpoint for image uploads"""
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.AllowAny]
    serializer_class = UploadFileSerializer
    queryset = ImageFile.objects.none()

    # def list(self, request, *args, **kwargs):
    #     try:
    #         return super().list(request, *args, **kwargs)
    #     except ValueError as err:
    #         data = {'queryError': str(err)}
    #         return response.Response(data=data, status=400)
