"""Development settings and globals."""

from .base import *
from os import environ

########## DEBUG CONFIGURATION
DEBUG = True
TEMPLATE_DEBUG = DEBUG
########## END DEBUG CONFIGURATION

# EMAIL CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = environ["DJANGO_DEV_GMAIL_USER"] + '@gmail.com'
EMAIL_HOST_PASSWORD = environ["DJANGO_DEV_GMAIL_PASSWORD"]
EMAIL_PORT = 587
EMAIL_USE_TLS = True

# END EMAIL CONFIGURATION
INSTALLED_APPS += (
    'debug_toolbar',
)

MIDDLEWARE_CLASSES += (
    'debug_toolbar.middleware.DebugToolbarMiddleware',
)

DEBUG_TOOLBAR_PATCH_SETTINGS = False

# http://django-debug-toolbar.readthedocs.org/en/latest/installation.html
INTERNAL_IPS = ('127.0.0.1', '84.211.75.214')
