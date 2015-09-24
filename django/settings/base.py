# -*- coding: utf-8 -*-
'''
Django settings for universitas_no project.
'''

from os.path import dirname
import django.conf.global_settings as DEFAULT_SETTINGS
from .setting_helpers import environment_variable, join_path

DEBUG = TEMPLATE_DEBUG = False
# Set your DSN value for Raven/Sentry error logging.
RAVEN_CONFIG = {'dsn': environment_variable('RAVEN_DSN'), }


INSTALLED_APPS = [  # CUSTOM APPS
    'apps.issues',
    'apps.stories',
    'apps.core',
    'apps.photo',
    'apps.frontpage',
    'apps.contributors',
    'apps.markup',
    'apps.legacy_db',
    'apps.adverts',
    'apps.search',
    # 'functional_tests',
]

INSTALLED_APPS = [  # THIRD PARTY APPS
    'compressor',
    'sekizai',
    'autocomplete_light',
    'django_extensions',
    'sorl.thumbnail',
    'watson',
    'raven.contrib.django.raven_compat',
] + INSTALLED_APPS

INSTALLED_APPS = [  # CORE APPS
    # 'django_admin_bootstrapped',  # must be before .admin
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
] + INSTALLED_APPS

MIDDLEWARE_CLASSES = [
    'raven.contrib.django.raven_compat.middleware.Sentry404CatchMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Prodsys for universitas.
PRODSYS_USER = environment_variable('PRODSYS_USER')
PRODSYS_PASSWORD = environment_variable('PRODSYS_PASSWORD')
PRODSYS_URL = environment_variable('PRODSYS_URL')

ROOT_URLCONF = 'core.urls'
SECRET_KEY = environment_variable('SECRET_KEY')
SITE_URL = environment_variable('SITE_URL')
WSGI_APPLICATION = 'core.wsgi.application'

LOGIN_URL = '/admin/login/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_URL = '/'

# SORL
THUMBNAIL_KVSTORE = 'sorl.thumbnail.kvstores.redis_kvstore.KVStore'
THUMBNAIL_ENGINE = 'apps.photo.custom_thumbnail_classes.CloseCropEngine'
THUMBNAIL_QUALITY = 70
FILE_UPLOAD_DIRECTORY_PERMISSIONS = 0o6770
FILE_UPLOAD_PERMISSIONS = 0o664
# Uncomment to enable original file names for resized images.
# THUMBNAIL_BACKEND = 'apps.photo.custom_thumbnail_classes.KeepNameThumbnailBackend'

# DATABASE
DATABASE_ROUTERS = ['apps.legacy_db.router.ProdsysRouter']
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': environment_variable('DB_NAME'),
        'USER': environment_variable('DB_USER'),
        'PASSWORD': environment_variable('DB_PASSWORD'),
        'HOST': 'localhost',
        'PORT': '5432',       # Set to empty string for default.
    },
    'prodsys': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': environment_variable('PRODSYS_DB_NAME'),
        'USER': environment_variable('PRODSYS_DB_USER'),
        'PASSWORD': environment_variable('PRODSYS_DB_PASSWORD'),
        'HOST': environment_variable('PRODSYS_DB_HOST'),
        'PORT': '',       # Set to empty string for default.
    }
}
# CACHE
CACHES = {
    'default': {
        'BACKEND': 'redis_cache.RedisCache',
        'LOCATION': 'localhost:6379',
        'OPTIONS': {
            'DB': 0,
            # 'PASSWORD': 'yadayada',
            'PARSER_CLASS': 'redis.connection.HiredisParser',
            'CONNECTION_POOL_CLASS': 'redis.BlockingConnectionPool',
            'CONNECTION_POOL_CLASS_KWARGS': {
                'max_connections': 50,
                'timeout': 20,
            }
        },
    },
}

# FOLDERS
# source code folder
BASE_DIR = environment_variable('SOURCE_FOLDER')
# outside of repo
PROJECT_DIR = dirname(BASE_DIR)
# collectstatic to here
STATIC_ROOT = join_path(PROJECT_DIR, 'static')
# gulp file revisions
GULP_FILEREVS_PATH = join_path(PROJECT_DIR, 'build', 'rev-manifest.json')
# User uploaded files
MEDIA_ROOT = '/srv/fotoarkiv_universitas'
# Django puts generated translation files here.
LOCALE_PATHS = [join_path(BASE_DIR, 'translation'), ]
# Extra path to collect static assest such as javascript and css
STATICFILES_DIRS = [join_path(PROJECT_DIR, 'build'), ]
# Project wide fixtures to be loaded into database.
FIXTURE_DIRS = [join_path(BASE_DIR, 'fixtures'), ]
# Project wide django template files
TEMPLATE_DIRS = [join_path(BASE_DIR, 'templates'), ]
# Log files here
LOG_FOLDER = join_path(PROJECT_DIR, 'logs')

# INTERNATIONALIZATION
LANGUAGE_CODE = 'NB_no'
TIME_ZONE = 'Europe/Oslo'
USE_I18N = True  # Internationalisation (string translation)
USE_L10N = True  # Localisation (numbers and stuff)
USE_TZ = True  # Use timezone
DATE_FORMAT = 'j. F, Y'
DATETIME_FORMAT = 'Y-m-d H:i'
SHORT_DATE_FORMAT = 'Y-m-d'
SHORT_DATETIME_FORMAT = 'y-m-d H:i'
TIME_INPUT_FORMATS = ('%H:%M', '%H', '%H:%M:%S', '%H.%M')

TEMPLATE_CONTEXT_PROCESSORS = DEFAULT_SETTINGS.TEMPLATE_CONTEXT_PROCESSORS + (
    'sekizai.context_processors.sekizai',
    'django.core.context_processors.request',
    'apps.issues.context_processors.issues',
    'apps.contributors.context_processors.staff',
)
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'compressor.finders.CompressorFinder',
]

STATIC_URL = '/static/'
MEDIA_URL = '/foto/'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
}
LOGGING['formatters'] = {
    'verbose': {
        'format': '%(name)s%(levelname)6s %(filename)25s:%(lineno)-4d (%(funcName)s) - %(message)s'
    },
    'simple': {
        'format': '%(levelname)s %(message)s'
    },
    'minimal': {
        'format': '%(message)s'
    },
}
LOGGING['handlers'] = {
    'mail_admins': {
        'level': 'ERROR',
        'class': 'django.utils.log.AdminEmailHandler',
    },
    'stream_to_console': {
        'level': 'DEBUG',
        'class': 'logging.StreamHandler',
        'formatter': 'verbose',
    },
    'file': {
        'level': 'WARNING',
        'class': 'logging.FileHandler',
        'filename': join_path(LOG_FOLDER, 'django.log'),
        'formatter': 'verbose',
    },
    'bylines_file': {
        'level': 'DEBUG',
        'class': 'logging.FileHandler',
        'filename': join_path(LOG_FOLDER, 'bylines.log'),
        'formatter': 'minimal',
    },
}
LOGGING['loggers'] = {
    'django.request': {
        'level': 'DEBUG', 'propagate': True,
        'handlers': ['mail_admins', 'stream_to_console'],
    },
    'universitas': {
        'level': 'DEBUG', 'propagate': False,
        'handlers': ['stream_to_console', 'file', ],
    },
    'bylines': {
        'level': 'DEBUG', 'propagate': False,
        'handlers': ['bylines_file'],
    },
    'sorl.thumbnail': {
        'level': 'ERROR', 'propagate': False,
        'handlers': ['file'],
    },
}
