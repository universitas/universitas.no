import logging
import re

from apps.contributors.models import Contributor
from apps.photo.models import ImageFile
from apps.photo.tasks import upload_imagefile_to_desken
from django.db import models
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from utils.serializers import AbsoluteURLField, CropBoxField

logger = logging.getLogger('apps')


class ImageFileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ImageFile
        fields = [
            'id',
            'url',
            'filename',
            'filesize',
            'artist',
            'description',
            'category',
            'contributor',
            'small',
            'large',
            # 'thumb',
            'original',
            'width',
            'height',
            'mimetype',
            'cropping_method',
            'method',
            'created',
            'modified',
            'crop_box',
            'usage',
        ]
        read_only_fields = [
            'original',
            'artist',
        ]

    contributor = serializers.PrimaryKeyRelatedField(
        queryset=Contributor.objects.all(),
        allow_null=True,
    )
    width = serializers.IntegerField(source='full_width')
    height = serializers.IntegerField(source='full_height')
    usage = serializers.IntegerField(read_only=True)
    crop_box = CropBoxField()
    original = AbsoluteURLField()
    small = AbsoluteURLField()
    large = AbsoluteURLField()
    # thumb = AbsoluteURLField()
    mimetype = serializers.SerializerMethodField()
    method = serializers.SerializerMethodField()

    def get_method(self, instance):
        return instance.get_cropping_method_display()

    def get_mimetype(self, instance):
        return instance.stat.mimetype


class ImageFileViewSet(viewsets.ModelViewSet):
    """ API endpoint that allows ImageFile to be viewed or updated.  """

    queryset = ImageFile.objects.order_by('-created').annotate(
        usage=models.Count('storyimage')
    )

    serializer_class = ImageFileSerializer
    filter_backends = (
        filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend
    )
    search_fields = ['stem', 'description', 'contributor__display_name']
    ordering_fields = ['created', 'modified']
    filterset_fields = ['category']

    # permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        search_parameters = {
            key: val
            for key, val in self.request.query_params.items()
            if key in {'fingerprint', 'imagehash', 'id'}
        }
        if search_parameters:
            qs = ImageFile.objects.search(**search_parameters)
        else:
            qs = self.queryset
        return qs

    def filter_queryset(self, queryset):
        search = self.request.query_params.get('search', '')
        numbers = re.findall(r'\b\d+\b', search)
        if numbers:
            return queryset.filter(id__in=[int(n) for n in numbers])
        return super().filter_queryset(queryset)

    @action(methods=['post'], detail=True)
    def push_file(self, request, pk):
        image_pk = self.get_object().pk
        upload_imagefile_to_desken.delay(image_pk)
        return Response(data={'pk': image_pk}, status=status.HTTP_202_ACCEPTED)
