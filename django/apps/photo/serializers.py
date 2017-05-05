from .models import ImageFile
from rest_framework import serializers, viewsets, filters
from rest_framework.exceptions import ValidationError
from .cropping.boundingbox import CropBox
from django_filters.rest_framework import DjangoFilterBackend
import json


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
            'cropping_method',
            'url',
            'preview',
            'md5',
            'full_width',
            'full_height',
            'source_file',
            'thumbnail',
            'preview',
            'crop_box',
        ]
        read_only_fields = [
            'source_file',
        ]

    thumbnail = serializers.SerializerMethodField()
    preview = serializers.SerializerMethodField()
    crop_box = CropBoxField()

    def get_thumbnail(self, instance):
        return self._context['request'].build_absolute_uri(
            instance.thumb())

    def get_preview(self, instance):
        return self._context['request'].build_absolute_uri(
            instance.preview())


class ImageFileViewSet(viewsets.ModelViewSet):

    """ API endpoint that allows ImageFile to be viewed or updated.  """

    queryset = ImageFile.objects.all()
    serializer_class = ImageFileSerializer
    filter_backends = (filters.SearchFilter, DjangoFilterBackend)
    search_fields = ('source_file',)

    def get_queryset(self):
        profile_images = self.request.query_params.get('profile_images', '')
        if profile_images.lower() in ['1', 'yes', 'true']:
            return self.queryset.profile_images()
        elif profile_images.lower() in ['0', 'no', 'false']:
            return self.queryset.photos()
        return self.queryset
