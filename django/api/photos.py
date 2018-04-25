import json
import logging
import re

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, serializers, status, viewsets
from rest_framework.decorators import detail_route
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from apps.contributors.models import Contributor
from apps.photo.cropping.boundingbox import CropBox
from apps.photo.models import ImageFile
from apps.photo.tasks import upload_imagefile_to_desken
from django.db import models

logger = logging.getLogger('apps')


class jsonDict(dict):
    def __str__(self):
        return json.dumps(self)


class CropBoxField(serializers.Field):
    def to_representation(self, obj):
        return jsonDict(obj.serialize())

    def to_internal_value(self, data):
        try:
            if isinstance(data, str):
                data = json.loads(data)
            return CropBox(**data)
        except (Exception) as err:
            raise ValidationError(str(err)) from err


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
            'thumb',
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
        ]

    artist = serializers.CharField(allow_blank=True)
    thumb = serializers.SerializerMethodField()
    small = serializers.SerializerMethodField()
    large = serializers.SerializerMethodField()
    width = serializers.IntegerField(source='full_width')
    height = serializers.IntegerField(source='full_height')
    mimetype = serializers.SerializerMethodField()
    original = serializers.SerializerMethodField()
    method = serializers.SerializerMethodField()
    usage = serializers.IntegerField(read_only=True)
    crop_box = CropBoxField()

    def _build_uri(self, url):
        return self._context['request'].build_absolute_uri(url)

    def find_artist(self, validated_data):
        """Assign artist to contributor if able."""
        # this is slightly hacky ....
        artist = validated_data.pop('artist', None)
        if not artist:
            return
        contributor = Contributor.objects.search(artist).first()
        validated_data['contributor'] = contributor
        if contributor is None:
            validated_data['copyright_information'] = artist
            validated_data['category'] = ImageFile.EXTERNAL

    def create(self, validated_data):
        self.find_artist(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        self.find_artist(validated_data)
        return super().update(instance, validated_data)

    def get_method(self, instance):
        return instance.get_cropping_method_display()

    def get_mimetype(self, instance):
        return instance.stat.mimetype

    def get_original(self, instance):
        return self._build_uri(instance.original.url)

    def get_thumb(self, instance):
        return self._build_uri(instance.preview.url)

    def get_small(self, instance):
        return self._build_uri(instance.small.url)

    def get_large(self, instance):
        return self._build_uri(instance.large.url)


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
    filter_fields = ['category']

    # permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        search_parameters = {
            key: val
            for key, val in self.request.query_params.items()
            if key in {'md5', 'fingerprint', 'imagehash', 'id'}
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

    @detail_route(methods=['post'])
    def push_file(self, request, pk):
        image_pk = self.get_object().pk
        upload_imagefile_to_desken.delay(image_pk)
        return Response(data={'pk': image_pk}, status=status.HTTP_202_ACCEPTED)
