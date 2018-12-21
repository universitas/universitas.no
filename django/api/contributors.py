import logging

from django.db.models import Prefetch
from rest_framework import serializers, viewsets
from url_filter.integrations.drf import DjangoFilterBackend

from apps.contributors import tasks
from apps.contributors.models import Contributor, Position, Stint
from apps.photo.models import ImageFile
from utils.serializers import AbsoluteURLField, PhoneNumberField

logger = logging.getLogger(__name__)


class PositionSerializer(serializers.ModelSerializer):
    """ModelSerializer for Position"""

    class Meta:
        model = Position
        fields = [
            'url',
            'id',
            'title',
            'is_management',
            'active',
        ]


class PositionViewSet(viewsets.ModelViewSet):
    """API endpoint that allows Position to be viewed or updated."""

    queryset = Position.objects.filter(active=True)
    serializer_class = PositionSerializer


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
            'stint_set',
            'position',
            'first_position',
            'title',
            'username',
        ]
        extra_kwargs = {
            'display_name': {'min_length': 3, 'max_length': 50},
            'status': {'required': True},
            'email': {'required': False},
        }

    username = serializers.CharField(source='user', read_only=True)

    byline_photo = serializers.PrimaryKeyRelatedField(
        many=False,
        queryset=ImageFile.objects.profile_images(),
        allow_null=True,
        required=False,
    )
    stint_set = StintSerializer(many=True, read_only=True)
    phone = PhoneNumberField(required=False)
    thumb = AbsoluteURLField()

    first_position = serializers.IntegerField(
        allow_null=True, write_only=True, required=False
    )

    def validate_status(self, value):
        if not value:
            raise serializers.ValidationError('invalid choice')
        return value

    def create(self, validated_data):
        position = validated_data.pop('first_position', None)
        contributor = Contributor.objects.create(**validated_data)
        if position:
            Stint.objects.create(
                contributor=contributor,
                position_id=int(position),
            )
        if contributor.email and contributor.status == Contributor.ACTIVE:
            user = tasks.connect_contributor_to_user(contributor, True)
            assert user.is_active == True, 'should be active'

        return contributor


class ContributorViewSet(viewsets.ModelViewSet):
    """API endpoint that allows Contributor to be viewed or updated."""

    queryset = Contributor.objects.order_by('display_name').prefetch_related(
        'user',
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
