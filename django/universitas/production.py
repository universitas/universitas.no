"""Production settings and globals."""

from .base import *

# DEBUG CONFIGURATION
DEBUG = False
THUMBNAIL_DEBUG = False

# EMAIL CONFIGURATION
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = environment_variable('GMAIL_USER') + '@gmail.com'
EMAIL_HOST_PASSWORD = environment_variable('GMAIL_PASSWORD')
EMAIL_PORT = 587
EMAIL_USE_TLS = True
