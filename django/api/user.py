from rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers


class AvatarUserDetailsSerializer(UserDetailsSerializer):
    """Custom django rest-auth user details serializer."""

    avatar = serializers.ImageField(
        source='contributor.byline_photo.preview', read_only=True)
    contributor_name = serializers.CharField(
        source='contributor.display_name', read_only=True)
    contributor = serializers.HyperlinkedRelatedField(
        view_name='contributor-detail',
        read_only=True,
    )

    class Meta(UserDetailsSerializer.Meta):
        fields = list(UserDetailsSerializer.Meta.fields) + [
            'avatar', 'contributor', 'contributor_name'
        ]
