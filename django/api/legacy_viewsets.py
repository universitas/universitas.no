import json
import logging

from apps.photo.models import ImageFile
from apps.stories.models import Story, StoryImage, StoryType
from rest_framework import authentication, serializers, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.renderers import BrowsableAPIRenderer, JSONRenderer
from url_filter.integrations.drf import DjangoFilterBackend

logger = logging.getLogger('apps')


class MissingImageFileException(Exception):
    pass


class ProdBildeSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryImage
        fields = [
            'prodbilde_id',
            'bildefil',
            'prioritet',
            'bildetekst',
        ]

    prodbilde_id = serializers.IntegerField(source='id', required=False)
    bildefil = serializers.CharField(source='filename')
    prioritet = serializers.IntegerField(source='size', required=False)
    bildetekst = serializers.CharField(source='caption')


def get_imagefile(filename):
    img = ImageFile.objects.search(filename=filename).last()
    if img is None:
        raise MissingImageFileException('ImageFile("%s") not found' % filename)
    return img


def create_or_update_story_image(
    story,
    prodbilde_id=None,
    bildefil=None,
    prioritet=None,
    bildetekst=None,
):
    if bildefil:
        try:
            imagefile = get_imagefile(bildefil)
        except MissingImageFileException as err:
            logger.warn(f'ignore missing image {err}')
            return
    elif prodbilde_id is None:
        raise ValidationError('missing image')

    if prodbilde_id:
        story_image = StoryImage.objects.get(pk=prodbilde_id)
    else:
        story_image, _ = StoryImage.objects.get_or_create(
            parent_story=story,
            imagefile=imagefile,
        )
    story_image.size = prioritet or 0
    story_image.caption = bildetekst or ''
    story_image.save()
    return story_image


class ProdStorySerializer(serializers.ModelSerializer):
    """ModelSerializer for Story based on legacy prodsys"""

    url_field_name = 'URL'

    class Meta:
        model = Story
        fields = [
            'bilete',
            'prodsak_id',
            'mappe',
            'arbeidstittel',
            'produsert',
            'tekst',
            'URL',
            'version_no',
        ]
        extra_kwargs = {'URL': {'view_name': 'legacy-detail'}}

    bilete = ProdBildeSerializer(required=False, many=True, source='images')
    prodsak_id = serializers.IntegerField(source='id', required=False)
    mappe = serializers.SerializerMethodField()
    arbeidstittel = serializers.CharField(source='working_title')
    produsert = serializers.IntegerField(source='publication_status')
    tekst = serializers.CharField(style={'base_template': 'textarea.html'})
    version_no = serializers.SerializerMethodField()

    def get_mappe(self, instance):
        return instance.story_type.prodsys_mappe

    def get_version_no(self, instance):
        return 1

    def to_internal_value(self, data):
        out = super().to_internal_value(data)
        out['images'] = data.get('bilete', [])
        mappe = data.get('mappe')
        if mappe:
            out['story_type'] = StoryType.objects.filter(
                prodsys_mappe=mappe
            ).first() or StoryType.objects.first()
        return out

    def create(self, validated_data):
        image_data = validated_data.pop('images', [])
        if Story.objects.filter(pk=validated_data.get('id')):
            raise ValidationError('Story exists')
        story = super().create(validated_data)
        for data in image_data:
            create_or_update_story_image(story=story, **data)
        return story

    def update(self, instance, validated_data):
        if instance.is_published:
            raise ValidationError('Cannot update published story.')
        image_data = validated_data.pop('images', [])
        story = super().update(instance, validated_data)
        if image_data:
            story.images.all().update(size=0)
        for data in image_data:
            create_or_update_story_image(story=story, **data)
        story.full_clean()
        update_images(bilete, story)
        story.full_clean(exclude=['url'])
        story.save()
        return story


class UnicodeJSONRenderer(JSONRenderer):
    ensure_ascii = True


class ProdStoryViewSet(viewsets.ModelViewSet):

    renderer_classes = (UnicodeJSONRenderer, BrowsableAPIRenderer)
    authentication_classes = (
        authentication.BasicAuthentication,
        authentication.SessionAuthentication
    )
    # permission_classes = (permissions.DjangoModelPermissionsOrAnonReadOnly,)

    serializer_class = ProdStorySerializer
    queryset = Story.objects.order_by('publication_status', 'modified').filter(
        publication_status__lt=Story.STATUS_PUBLISHED,
    ).prefetch_related(
        'story_type',
        'bylines',
        'byline_set',
        'images',
    )
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['publication_status', 'title', 'bodytext_markup']
