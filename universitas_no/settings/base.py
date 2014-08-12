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
PROJECT_ROOT_FOLDER = dirname(BASE_DIR)

# These values are set in the virtualenv postactivate bash file

SECRET_KEY = environ["DJANGO_SECRET_KEY"]
SITE_NAME = environ["DJANGO_SITE_NAME"]

# Prodsys for universitas.
PRODSYS_USER = environ["DJANGO_PRODSYS_USER"]
PRODSYS_PASSWORD = environ["DJANGO_PRODSYS_PASSWORD"]
PRODSYS_URL = environ["DJANGO_PRODSYS_URL"]

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
TEMPLATE_DEBUG = DEBUG
ALLOWED_HOSTS = environ["DJANGO_ALLOWED_HOSTS"].split()

# CUSTOM APPS
INSTALLED_APPS = (
    'apps.stories',
    'apps.core',
    'apps.photo',
    'apps.frontpage',
    'apps.prodsys_api_access',
    # 'apps.legacy_db',
    'apps.contributors',
    'functional_tests',
    )

# THIRD PARTY APPS
INSTALLED_APPS = (
    'django_extensions',
    'compressor',
    'sekizai',
    ) + INSTALLED_APPS

# CORE APPS
INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    ) + INSTALLED_APPS


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
        'NAME': environ["DJANGO_DB_NAME"],
        'USER': environ["DJANGO_DB_USER"],
        'PASSWORD': environ["DJANGO_DB_PASSWORD"],
        'HOST': 'localhost',
        'PORT': '',       # Set to empty string for default.
    },
#     'prodsys': {
#         'ENGINE': 'mysql.connector.django',
#         'NAME': environ["DJANGO_DB_NAME_PRODSYS"],
#         'USER': environ["DJANGO_DB_USER_PRODSYS"],
#         'PASSWORD': environ["DJANGO_DB_PASSWORD_PRODSYS"],
#         'HOST': environ["DJANGO_DB_HOST_PRODSYS"],
#         'PORT': '',       # Set to empty string for default.
#     }
}
# DATABASE_ROUTERS = ['legacy_db.router.ProdsysRouter']

# INTERNATIONALIZATION
LANGUAGE_CODE = 'no'
TIME_ZONE = 'Europe/Oslo'
USE_I18N = True  # Internationalisation (string translation)
USE_L10N = True  # Localisation (numbers and stuff)
USE_TZ = True  # Use timezone

# STATIC FILE CONFIGURATION
STATIC_ROOT = normpath(join(PROJECT_ROOT_FOLDER, 'static'))
STATIC_URL = '/static/'
STATICFILES_DIRS = (
    normpath(join(BASE_DIR, 'assets')),
)
MEDIA_ROOT = normpath(join(STATIC_ROOT, 'uploads'))
MEDIA_URL = '/media/'
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

LOG_FOLDER = (
    normpath(join(PROJECT_ROOT_FOLDER, 'logs')),
)