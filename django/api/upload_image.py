import logging

import apps.photo.file_operations as ops
from apps.photo.exif import exif_to_json
from apps.photo.models import ImageFile
from .photos import ImageFileSerializer
from rest_framework import (
    permissions,
    response,
    serializers,
    viewsets,
    mixins,
    status,
)
from rest_framework.parsers import FormParser, MultiPartParser

logger = logging.getLogger('apps')


class UploadFileSerializer(ImageFileSerializer):
    original = serializers.FileField(required=True)

    class Meta:
        model = ImageFile
        fields = [
            'url',
            'name',
            'original',
            'large',
            'description',
            '_imagehash',
            '_md5',
        ]
        read_only_fields = [
            'crop_box',
        ]


class FileUploadViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Endpoint for image uploads.
    Also search for duplicates with queryparams"""
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]
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

    def create(self, request):

        file = request.FILES.get('original')
        if not file:
            return response.Response(data={'error': 'no file'}, status=400)
        data = dict(
            name=file.name,
            content_type=file.content_type,
            size=file.size,
            md5=ops.get_md5(file),
            imagehash=str(ops.get_imagehash(file)),
            exif=exif_to_json(file),
        )
        if file.content_type in ('image/jpeg', 'image/png'):
            st = status.HTTP_201_CREATED
        else:
            st = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
            data['error'] = 'not an image file'
        return response.Response(data=data, status=st)
