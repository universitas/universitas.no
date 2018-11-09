import logging

from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.adverts.models import Advert
from apps.adverts.tanke_og_teknikk import fetch_ads
from django.conf import settings

logger = logging.getLogger('apps')


class AdvertSerializer(serializers.ModelSerializer):
    """ModelSerializer for Advert"""

    class Meta:
        model = Advert
        exclude = []


def proxy_images(ad):
    if settings.DEBUG:
        return ad
    ad['image'] = ad['image'].replace(
        'http://tankeogteknikk.no/qmedia/', '/qmedia/'
    )
    return ad


class AdvertViewSet(viewsets.ModelViewSet):
    """
    API endpoint to fetch Adverts.
    """

    queryset = Advert.objects.published_at()
    serializer_class = AdvertSerializer

    @action(methods=['get'], detail=False)
    def qmedia(self, request):
        ads = [proxy_images(ad) for ad in fetch_ads()]
        return Response({'qmedia': ads})
