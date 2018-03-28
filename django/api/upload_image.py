import logging

import apps.photo.file_operations as ops
from apps.contributors.models import Contributor
from apps.photo.exif import exif_to_json
from apps.photo.models import ImageFile
from rest_framework import (
    mixins, permissions, response, serializers, status, viewsets
)
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
            'name',
            'original',
            'small',
            'description',
            'artist',
            '_imagehash',
            'stat',
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
            validated_data['copyright_information'] = f'{artist} / Universitas'
        except Contributor.DoesNotExist:
            validated_data['copyright_information'] = artist
        return super().create(validated_data)


class FileUploadViewSet(
    viewsets.GenericViewSet, mixins.ListModelMixin, mixins.CreateModelMixin
):
    """Endpoint for image uploads.
    Also search for duplicates with queryparams"""
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.AllowAny]
    serializer_class = UploadFileSerializer

    def get_queryset(self):
        kwargs = {
            key: val
            for key, val in self.request.query_params.items()
            if key in {'md5', 'fingerprint', 'imagehash', 'id'}
        }
        if kwargs:
            return ImageFile.objects.search(**kwargs)
        return ImageFile.objects.none()

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except ValueError as err:
            data = {'queryError': str(err)}
            return response.Response(data=data, status=400)

    # def create(self, request):

    #     file = request.FILES.get('original')
    #     if not file:
    #         return response.Response(data={'error': 'no file'}, status=400)
    #     data = dict(
    #         name=file.name,
    #         content_type=file.content_type,
    #         size=file.size,
    #         md5=ops.get_md5(file),
    #         imagehash=str(ops.get_imagehash(file)),
    #         exif=exif_to_json(file),
    #     )
    #     if file.content_type in ('image/jpeg', 'image/png'):
    #         st = status.HTTP_201_CREATED
    #     else:
    #         st = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
    #         data['error'] = 'not an image file'
    #     return response.Response(data=data, status=st)
