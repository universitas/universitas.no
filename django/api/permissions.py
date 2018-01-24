# from django.contrib.auth.models import User
# from django.shortcuts import get_object_or_404
# from myapps.serializers import UserSerializer
from django.contrib.auth.models import Permission
from rest_framework import pagination, serializers, viewsets


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['codename']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        return ret['codename']


class LargeResultsSetPagination(pagination.PageNumberPagination):
    page_size = 1000
    page_size_query_param = 'page_size'
    max_page_size = 10000


class PermissionViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for listing or retrieving permissions.
    """

    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    pagination_class = LargeResultsSetPagination

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return self.queryset
        if user.is_anonymous:
            return self.queryset.none()
        return self.queryset.filter(group__user=user
                                    ).union(user.user_permissions.all())
