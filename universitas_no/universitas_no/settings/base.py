# -*- coding: utf-8 -*-
"""
Django settings for universitas_no project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: path.join(SITE_ROOT, ...)
from os import environ
from os.path import abspath, dirname, join, normpath
import django.conf.global_settings as DEFAULT_SETTINGS

# PATH CONFIGURATION
# Absolute filesystem path to the Django project directory:
BASE_DIR = dirname(dirname(dirname(abspath(__file__))))

# Absolute filesystem path to the top-level project folder:
SITE_ROOT = dirname(BASE_DIR)

# Site name:
SITE_NAME = "universitas.no"

# END PATH CONFIGURATION

# These values are set in the virtualenv postactivate bash file
SECRET_KEY = environ["DJANGO_SECRET_KEY"]
DB_PASSWORD = environ["DJANGO_DB_PASSWORD"]
DB_NAME = environ["DJANGO_DB_NAME"]
DB_USER = environ["DJANGO_DB_USER"]
PRODSYS_USER = environ["DJANGO_PRODSYS_USER"]
PRODSYS_PASSWORD = environ["DJANGO_PRODSYS_PASSWORD"]
PRODSYS_URL = environ["DJANGO_PRODSYS_URL"]

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
TEMPLATE_DEBUG = DEBUG
ALLOWED_HOSTS = ['*.universitas.no']
STAGING = 'base'

# CORE APPS
INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    )

# THIRD PARTY APPS
INSTALLED_APPS += (
    'django_extensions',
    'compressor',
    'sekizai',
    )

# CUSTOM APPS
INSTALLED_APPS += (
    'stories',
    'core',
    'frontpage',
    )


MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'universitas_no.urls'
WSGI_APPLICATION = 'universitas_no.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': DB_NAME,
        'USER': DB_USER,
        'PASSWORD': DB_PASSWORD,
        'HOST': 'localhost',
        'PORT': '',       # Set to empty string for default.
    }
}

# INTERNATIONALIZATION
LANGUAGE_CODE = 'no'
TIME_ZONE = 'Europe/Oslo'
USE_I18N = True  # Internationalisation (string translation)
USE_L10N = True  # Localisation (numbers and stuff)
USE_TZ = True  # Use timezone

# MEDIA CONFIGURATION
MEDIA_ROOT = normpath(join(SITE_ROOT, 'media'))
MEDIA_URL = '/media/'
# END MEDIA CONFIGURATION

# STATIC FILE CONFIGURATION
STATIC_ROOT = normpath(join(SITE_ROOT, 'static'))
STATIC_URL = '/static/'
STATICFILES_DIRS = (
    normpath(join(BASE_DIR, 'assets')),
)
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
)
# END STATIC FILE CONFIGURATION

# TEMPLATES AND FIXTURES CONFIGURATION
FIXTURE_DIRS = (
    normpath(join(BASE_DIR, 'fixtures')),
)
TEMPLATE_DIRS = (
    normpath(join(BASE_DIR, 'templates')),
)
TEMPLATE_CONTEXT_PROCESSORS = DEFAULT_SETTINGS.TEMPLATE_CONTEXT_PROCESSORS + (
    'sekizai.context_processors.sekizai',
)
# END TEMPLATES AND FIXTURES CONFIGURATION
