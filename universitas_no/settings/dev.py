"""Development settings and globals."""

from .base import *
from os import environ

########## DEBUG CONFIGURATION
DEBUG = True
TEMPLATE_DEBUG = DEBUG
ALLOWED_HOSTS= ['.universitas.no']
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
INTERNAL_IPS = ('84.211.75.214')

# DATABASES['prodsys']['HOST'] = 'localhost'
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': environ["DJANGO_DB_NAME"],
        'USER': environ["DJANGO_DB_USER"],
        'PASSWORD': environ["DJANGO_DB_PASSWORD"],
        'HOST': 'localhost',
        'PORT': '',       # Set to empty string for default.
    },
    'prodsys': {
        'ENGINE': 'mysql.connector.django',
        'NAME': environ["DJANGO_PRODSYS_DB_NAME"],
        'USER': environ["DJANGO_PRODSYS_DB_USER"],
        'PASSWORD': environ["DJANGO_PRODSYS_DB_PASSWORD"],
        'HOST': environ["DJANGO_PRODSYS_DB_HOST"],
        # 'HOST': 'localhost', # TODO: Endre dette tilbake det er bare et eksperiment.
        'PORT': '',       # Set to empty string for default.
    }
}
