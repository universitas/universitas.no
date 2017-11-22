""" Core context processor """

from django.conf import settings


def core(request):
    return {'facebook': {'app_id': settings.FACEBOOK_APP_ID}}
