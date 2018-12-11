from rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers

from django.contrib.auth.models import Permission

from .permissions import PermissionSerializer


class AvatarUserDetailsSerializer(UserDetailsSerializer):
    """Custom django rest-auth user details serializer."""

    avatar = serializers.ImageField(
        source='contributor.byline_photo.preview', read_only=True
    )
    contributor_name = serializers.CharField(
        source='contributor.display_name', read_only=True
    )
    contributor = serializers.HyperlinkedRelatedField(
        view_name='contributor-detail',
        read_only=True,
    )

    permissions = serializers.SerializerMethodField()

    def get_permissions(self, user):
        qs = Permission.objects.filter(group__user=user).union(
            user.user_permissions.all()
        )
        return PermissionSerializer(qs, many=True).data

    class Meta(UserDetailsSerializer.Meta):
        fields = list(UserDetailsSerializer.Meta.fields) + [
            'avatar',
            'contributor',
            'contributor_name',
            'permissions',
        ]
