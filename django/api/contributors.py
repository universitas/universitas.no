from rest_framework import serializers, viewsets
from url_filter.integrations.drf import DjangoFilterBackend

from apps.contributors.models import Contributor, Stint
from utils.serializers import AbsoluteURLField


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
            'position',
        ]

    byline_photo = serializers.HyperlinkedRelatedField(
        many=False,
        read_only=True,
        view_name='imagefile-detail',
    )
    stint_set = StintSerializer(many=True, read_only=True)
    thumb = AbsoluteURLField()


class ContributorViewSet(viewsets.ModelViewSet):
    """API endpoint that allows Contributor to be viewed or updated."""

    queryset = Contributor.objects.all().prefetch_related(
        'stint_set__position', 'byline_photo'
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
