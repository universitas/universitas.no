"""Production settings and globals."""

import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

from .base import *  # noqa
from .setting_helpers import Environment

# DEBUG CONFIGURATION
DEBUG = False
THUMBNAIL_DEBUG = DEBUG

# EMAIL CONFIGURATION
gmail = Environment('GMAIL')
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = gmail.user + '@gmail.com'
EMAIL_HOST_PASSWORD = gmail.password
EMAIL_PORT = 587
EMAIL_USE_TLS = True

# SENTRY ERROR LOGGING
env = Environment()
if env.sentry_url:
    sentry_sdk.init(
        dsn=env.sentry_url,
        release=env.git_sha,
        server_name=env.site_url,
        integrations=[DjangoIntegration()]
    )
