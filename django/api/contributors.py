from apps.contributors.models import Contributor, Stint
from rest_framework import filters, serializers, viewsets
from url_filter.integrations.drf import DjangoFilterBackend


class StintSerializer(serializers.ModelSerializer):
    """ModelSerializer for Stint"""

    class Meta:
        model = Stint
        fields = [
            'position',
            'start_date',
            'end_date',
        ]

    position = serializers.SlugRelatedField(
        read_only=True,
        slug_field='title',
    )


class ContributorSerializer(serializers.HyperlinkedModelSerializer):
    """ModelSerializer for Contributor"""

    class Meta:
        model = Contributor
        fields = [
            'id',
            'url',
            'status',
            'display_name',
            'phone',
            'email',
            'byline_photo',
            'thumb',
            'verified',
            'stint_set',
        ]

    byline_photo = serializers.HyperlinkedRelatedField(
        many=False,
        read_only=True,
        view_name='imagefile-detail',
    )
    stint_set = StintSerializer(many=True, read_only=True)
    thumb = serializers.SerializerMethodField()

    def get_thumb(self, instance):
        if not instance.byline_photo:
            return None
        build_uri = self._context['request'].build_absolute_uri
        thumbfile = instance.byline_photo.preview
        return build_uri(thumbfile.url)


class ContributorViewSet(viewsets.ModelViewSet):
    """API endpoint that allows Contributor to be viewed or updated."""

    queryset = Contributor.objects.all().prefetch_related(
        'stint_set__position', 'byline_photo'
    )
    serializer_class = ContributorSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filter_fields = ['status', 'display_name', 'byline_photo']
    search_fields = ['display_name']
