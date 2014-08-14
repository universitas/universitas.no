"""Production settings and globals."""

from __future__ import absolute_import

from .base import *
from os import environ


# DEBUG CONFIGURATION
DEBUG = False
TEMPLATE_DEBUG = DEBUG
ALLOWED_HOSTS = [environ['DJANGO_SITE_URL'],]
# END DEBUG CONFIGURATION


# EMAIL CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = environ['DJANGO_DEV_GMAIL_USER'] + '@gmail.com'
EMAIL_HOST_PASSWORD = environ['DJANGO_DEV_GMAIL_PASSWORD']
EMAIL_PORT = 587
EMAIL_USE_TLS = True

# END EMAIL CONFIGURATION

# CACHE CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#caches
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}
# END CACHE CONFIGURATION
