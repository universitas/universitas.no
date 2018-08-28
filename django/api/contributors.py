from rest_framework import serializers, viewsets
from url_filter.integrations.drf import DjangoFilterBackend

from apps.contributors.models import Contributor, Stint
from apps.photo.models import ImageFile
from django.db.models import Prefetch
from utils.serializers import AbsoluteURLField


class StintSerializer(serializers.ModelSerializer):
    """ModelSerializer for Stint"""

    class Meta:
        model = Stint
        fields = [
            'id',
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
            'position',
        ]

    byline_photo = serializers.PrimaryKeyRelatedField(
        many=False,
        queryset=ImageFile.objects.profile_images(),
        allow_null=True,
    )
    stint_set = StintSerializer(many=True, read_only=True)
    thumb = AbsoluteURLField()


class ContributorViewSet(viewsets.ModelViewSet):
    """API endpoint that allows Contributor to be viewed or updated."""

    queryset = Contributor.objects.order_by('display_name').prefetch_related(
        'byline_photo',
        Prefetch(
            'stint_set', queryset=Stint.objects.select_related('position')
        ),
    )
    serializer_class = ContributorSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['status', 'display_name', 'byline_photo']

    def get_queryset(self):
        """
        use fancy postgresql trigram unaccent search
        """
        query = self.request.query_params.get('search')
        if query is not None:
            return self.queryset.search(query)

        return self.queryset
