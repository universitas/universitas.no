from apps.stories.models import Story, StoryImage
from apps.photo.models import ImageFile
from rest_framework import serializers, viewsets
from url_filter.integrations.drf import DjangoFilterBackend


class ProdBildeSerializer(serializers.ModelSerializer):

    class Meta:
        model = StoryImage
        fields = [
            'prodbilde_id',
            'bildefil',
            'prioritet',
            'bildetekst',
        ]

    prodbilde_id = serializers.IntegerField(source='id')
    bildefil = serializers.CharField(source='filename')
    prioritet = serializers.IntegerField(source='size')
    bildetekst = serializers.CharField(source='caption')


def get_imagefile(filename):
    return ImageFile.objects.filter(source_file__endswith=filename).last()


def update_story_image(pk, bildefil=None, prioritet=None, bildetekst=None):
    story_image = StoryImage.object.get(pk)
    if bildefil and bildefil != story_image.filename:
        story_image.image_file = get_imagefile(bildefil)
    if prioritet is not None:
        story_image.size = prioritet
    if bildetekst is not None:
        story_image.caption = bildetekst
    story_image.save()
    return story_image


def create_story_image(story, bildefil, prioritet=0, bildetekst=''):
    image_file = get_imagefile(bildefil)
    return StoryImage.objects.create(
        parent_story=story,
        imagefile=image_file,
        size=prioritet,
        caption=bildetekst,
    )


class ProdStorySerializer(serializers.ModelSerializer):

    """ModelSerializer for Story based on legacy prodsys"""

    class Meta:
        model = Story
        fields = [
            'bilete',
            'prodsak_id',
            'mappe',
            'arbeidstittel',
            'produsert',
            'tekst',
            'url',
            'version_no',
        ]

    bilete = ProdBildeSerializer(many=True, source='get_images')
    prodsak_id = serializers.IntegerField(source='id')
    mappe = serializers.SerializerMethodField()
    arbeidstittel = serializers.CharField(source='title')
    produsert = serializers.IntegerField(source='publication_status')
    tekst = serializers.CharField(source='bodytext_markup')
    version_no = serializers.SerializerMethodField()

    def _build_uri(self, url):
        return self._context['request'].build_absolute_uri(url)

    def get_mappe(self, instance):
        return instance.story_type.prodsys_mappe

    def get_version_no(self, instance):
        return 1

    def to_internal_value(self, data):
        out = super().to_internal_value(data)
        out['get_images'] = data.get('bilete', [])
        return out

    def update(self, instance, validated_data):

        images = validated_data.pop('get_images', [])
        for img_data in images:
            pk = img_data.get('prodbilde_id', 0)
            if pk:
                update_story_image(pk, **img_data)
            else:
                create_story_image(instance, **img_data)

        return super().update(instance, validated_data)


class ProdStoryViewSet(viewsets.ModelViewSet):

    serializer_class = ProdStorySerializer
    queryset = Story.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['publication_status', 'title', 'bodytext_markup']
