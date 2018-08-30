import logging
import re

from apps.contributors.models import Contributor
from apps.photo.models import ImageFile
from apps.photo.tasks import upload_imagefile_to_desken
from django.db import models
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, serializers, status, viewsets
from rest_framework.decorators import detail_route
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

    contributor = serializers.PrimaryKeyRelatedField(
        queryset=Contributor.objects.all(),
        allow_null=True,
    )
    artist = serializers.CharField(allow_blank=True)
    width = serializers.IntegerField(source='full_width')
    height = serializers.IntegerField(source='full_height')
    mimetype = serializers.SerializerMethodField()
    method = serializers.SerializerMethodField()
    usage = serializers.IntegerField(read_only=True)
    crop_box = CropBoxField()
    original = AbsoluteURLField(source='original.url')
    small = AbsoluteURLField(source='small.url')
    large = AbsoluteURLField(source='large.url')
    thumb = AbsoluteURLField(source='preview.url')

    def find_artist(self, validated_data):
        """Assign artist to contributor if able."""
        # this is slightly hacky ....
        logger.info(str(validated_data))
        artist = validated_data.pop('artist', '?')
        if artist != '?':
            if validated_data.get('category') != ImageFile.EXTERNAL:
                contributor = Contributor.objects.search(artist, 0.2).first()
            else:
                contributor = None
            validated_data['contributor'] = contributor
            if contributor is None:
                validated_data['copyright_information'] = artist
                if artist:
                    validated_data['category'] = ImageFile.EXTERNAL

        logger.info(str(validated_data))

    def create(self, validated_data):
        self.find_artist(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        category = validated_data.get('category')
        artist = validated_data.get('artist')

        if not category:
            validated_data['category'] = instance.category
        elif category != instance.category and not artist:
            validated_data['artist'] = instance.artist

        self.find_artist(validated_data)
        return super().update(instance, validated_data)

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
