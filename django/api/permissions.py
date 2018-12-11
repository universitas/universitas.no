from rest_framework import mixins, permissions, serializers, viewsets

from django.contrib.auth.models import Permission


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['codename']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        return ret['codename']


class PermissionViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """Retrieve a list of the currently logged in user's django permissions"""

    serializer_class = PermissionSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Permission.objects.all()
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return self.queryset
        if user.is_anonymous:
            return self.queryset.none()
        return self.queryset.filter(group__user=user).union(
            user.user_permissions.all()
        )
