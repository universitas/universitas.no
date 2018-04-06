from rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers


class AvatarUserDetailsSerializer(UserDetailsSerializer):

    avatar = serializers.SerializerMethodField()

    def get_avatar(self, instance):
        try:
            img = instance.contributor.byline_photo.preview
            return self._build_uri(img.url)
        except AttributeError:
            # no byline photo
            return None

    def _build_uri(self, url):
        return self._context['request'].build_absolute_uri(url)

    class Meta(UserDetailsSerializer.Meta):
        fields = list(UserDetailsSerializer.Meta.fields) + ['avatar']
