from .models import ImageFile
from rest_framework import serializers, viewsets, filters
from rest_framework.exceptions import ValidationError
from .cropping.boundingbox import CropBox
from django_filters.rest_framework import DjangoFilterBackend
import json
from pathlib import Path


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
            'created',
            'cropping_method',
            'method',
            'size',
            'thumb',
            'small',
            'src',
            '_imagehash',
            'crop_box',
            'is_profile_image',
        ]
        read_only_fields = [
            'source_file',
        ]

    thumb = serializers.SerializerMethodField()
    filename = serializers.SerializerMethodField()
    small = serializers.SerializerMethodField()
    src = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    method = serializers.SerializerMethodField()
    crop_box = CropBoxField()

    def get_method(self, instance):
        return instance.get_cropping_method_display()

    def get_filename(self, instance):
        return Path(instance.source_file.name).name

    def get_size(self, instance):
        return [instance.full_width, instance.full_height]

    def get_small(self, instance):
        return self._context['request'].build_absolute_uri(
            instance.small.url)

    def get_src(self, instance):
        return self._context['request'].build_absolute_uri(
            instance.large.url)

    def get_thumb(self, instance):
        return self._context['request'].build_absolute_uri(
            instance.preview.url)


class ImageFileViewSet(viewsets.ModelViewSet):

    """ API endpoint that allows ImageFile to be viewed or updated.  """

    queryset = ImageFile.objects.order_by('-created')
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
