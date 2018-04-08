from rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers


class AvatarUserDetailsSerializer(UserDetailsSerializer):

    avatar = serializers.SerializerMethodField()
    contributor_name = serializers.SerializerMethodField()

    def get_avatar(self, instance):
        try:
            img = instance.contributor.byline_photo.preview
            return self._build_uri(img.url)
        except AttributeError:
            # no byline photo
            return None

    def get_contributor_name(self, instance):
        try:
            return instance.contributor.display_name
        except AttributeError:
            return None

    def _build_uri(self, url):
        return self._context['request'].build_absolute_uri(url)

    class Meta(UserDetailsSerializer.Meta):
        fields = list(UserDetailsSerializer.Meta.fields
                      ) + ['avatar', 'contributor', 'contributor_name']
