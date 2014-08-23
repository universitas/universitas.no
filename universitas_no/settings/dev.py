"""Development settings and globals."""

from .base import *
from os import environ


# EMAIL CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = environ["DJANGO_DEV_GMAIL_USER"] + '@gmail.com'
EMAIL_HOST_PASSWORD = environ["DJANGO_DEV_GMAIL_PASSWORD"]
EMAIL_PORT = 587
EMAIL_USE_TLS = True

# END EMAIL CONFIGURATION
