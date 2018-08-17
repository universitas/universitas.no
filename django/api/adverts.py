import logging

from apps.adverts.models import Advert
from apps.adverts.tanke_og_teknikk import fetch_ads
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

logger = logging.getLogger('apps')


class AdvertSerializer(serializers.ModelSerializer):
    """ModelSerializer for Advert"""

    class Meta:
        model = Advert
        exclude = []


class AdvertViewSet(viewsets.ModelViewSet):
    """
    API endpoint to fetch Adverts.
    """

    queryset = Advert.objects.published_at()
    serializer_class = AdvertSerializer

    @action(methods=['get'], detail=False)
    def qmedia(self, request):
        return Response(fetch_ads())
