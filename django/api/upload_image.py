# from rest_framework import serializers, views, viewsets, filters
import logging

import apps.photo.file_operations as ops
from apps.photo.exif import exif_to_json
from rest_framework import permissions, response, serializers, views
from rest_framework.parsers import FormParser, MultiPartParser

logger = logging.getLogger('apps')


class FileSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)


class FileUploadView(views.APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FileSerializer

    def post(self, request):

        file = request.FILES.get('file')
        if not file:
            return response.Response(data={'fail': 'no file'}, status=400)
        data = dict(
            name=file.name,
            content_type=file.content_type,
            size=file.size,
            md5=ops.get_md5(file),
            imagehash=str(ops.get_imagehash(file)),
            exif=exif_to_json(file),
        )
        return response.Response(data=data, status=201)
