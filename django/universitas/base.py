""" Django settings for universitas_no project. """

from django.utils.translation import ugettext_lazy as _

from .logging_settings import LOGGING  # NOQA
from .setting_helpers import joinpath as path
from .setting_helpers import Environment

env = Environment(strict=False)
redis_host = env.redis_host or 'redis'
redis_port = env.redis_port or 6379

DEBUG = True if env.debug.lower() == 'true' else False
TEMPLATE_DEBUG = DEBUG
SITE_URL = env.site_url or 'www.example.com'
SECRET_KEY = env.secret_key
ALLOWED_HOSTS = env.allowed_hosts.split(',') or '*'
SILENCED_SYSTEM_CHECKS = ["1_8.W001"]

# DJANGO REST FRAMEWORK
REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PAGINATION_CLASS': (
        'rest_framework.pagination.LimitOffsetPagination'
    ),
    'PAGE_SIZE': 50,
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
}

# SENTRY
RAVEN_CONFIG = {'dsn': env.raven_dsn, 'site': SITE_URL}
SENTRY_CLIENT = 'raven.contrib.django.raven_compat.DjangoClient'

# CELERY TASK RUNNER
CELERY_TASK_DEFAULT_QUEUE = SITE_URL
CELERY_ACCEPT_CONTENT = ['json', 'pickle']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_RESULT_BACKEND = 'redis://{}:{}/{}'.format(redis_host, redis_port, 5)
CELERYD_HIJACK_ROOT_LOGGER = False
CELERY_BROKER_TRANSPORT_OPTIONS = {'fanout_prefix': True}

# CELERYBEAT_PID_FILE = '/var/run/celery-%n.pid'
# CELERY_SCHEDULE_FILE = '/var/run/celery-schedule-%n'

# Rabbitmq
CELERY_BROKER_URL = 'amqp://guest:guest@rabbit//?heartbeat=30'
CELERY_BROKER_POOL_LIMIT = 10
CELERY_BROKER_CONNECTION_TIMEOUT = 10

# STATIC_ROOT = 'static'
# MEDIA_ROOT = 'media'

# CUSTOM APPS
INSTALLED_APPS = [
    'apps.issues',
    'apps.stories',
    'apps.core',
    'apps.photo',
    'apps.frontpage',
    'apps.contributors',
    'apps.markup',
    'apps.adverts',
    'apps.search',
]

# THIRD PARTY APPS
INSTALLED_APPS = [
    'autocomplete_light',
    'django_extensions',
    'sorl.thumbnail',
    'watson',
    'raven.contrib.django.raven_compat',
    'storages',
    'webpack_loader',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_auth',
    'crispy_forms',
    'django_filters',
] + INSTALLED_APPS

# CORE APPS
INSTALLED_APPS = [
    'django.forms',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
] + INSTALLED_APPS

MIDDLEWARE_CLASSES = [
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

WSGI_APPLICATION = 'universitas.wsgi.application'
ROOT_URLCONF = 'universitas.urls'

LOGIN_URL = '/admin/login/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_URL = '/'

# SORL
THUMBNAIL_KVSTORE = 'sorl.thumbnail.kvstores.redis_kvstore.KVStore'
THUMBNAIL_ENGINE = 'apps.photo.cropping.crop_engine.CloseCropEngine'
THUMBNAIL_QUALITY = 75
FILE_UPLOAD_DIRECTORY_PERMISSIONS = 0o6770
FILE_UPLOAD_PERMISSIONS = 0o664
# Enable original file names for resized images.
THUMBNAIL_BACKEND = 'apps.photo.thumb_backend.KeepNameThumbnailBackend'
# With boto and aman s3, we don't check if file exist.
# Automatic overwrite if not found in cache key
THUMBNAIL_FORCE_OVERWRITE = True
THUMBNAIL_PREFIX = 'thumb-cache/'
THUMBNAIL_REDIS_DB = 1
THUMBNAIL_REDIS_HOST = redis_host
THUMBNAIL_KEY_PREFIX = SITE_URL
THUMBNAIL_URL_TIMEOUT = 3

# DATABASE
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': env.pg_name or 'postgres',
        'USER': env.pg_user or 'postgres',
        'PASSWORD': env.pg_password or 'postgres',
        'HOST': env.pg_host or 'postgres',
        'PORT': env.pg_port or '',  # Set to empty string for default.
    }
}
# CACHE
CACHE_MIDDLEWARE_KEY_PREFIX = SITE_URL
CACHES = {
    'default': {
        'BACKEND': 'redis_cache.RedisCache',
        'LOCATION': '{}:{}'.format(redis_host, redis_port),
        'OPTIONS': {
            'DB': 0,
            'MAX_ENTRIES': 1000,
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
BASE_DIR = path()

# Django puts generated translation files here.
LOCALE_PATHS = [path('translation')]
# Extra path to collect static assest such as javascript and css
STATICFILES_DIRS = [env.BUILD_DIR]
# Project wide fixtures to be loaded into database.
FIXTURE_DIRS = [path('fixtures')]
# Look for byline images here
STAGING_ROOT = '/var/staging/'
BYLINE_PHOTO_DIR = STAGING_ROOT + 'BYLINE/'

# INTERNATIONALIZATIONh
LANGUAGE_CODE = 'nb'
LANGUAGES = [
    ('nb', _('Norwegian Bokmal')),
    ('nn', _('Norwegian Nynorsk')),
    ('en', _('English')),
]

TIME_ZONE = 'Europe/Oslo'
USE_I18N = True  # Internationalisation (string translation)
USE_L10N = True  # Localisation (numbers and stuff)
USE_TZ = True  # Use timezone
DATE_FORMAT = 'j. F, Y'
DATETIME_FORMAT = 'Y-m-d H:i'
SHORT_DATE_FORMAT = 'Y-m-d'
SHORT_DATETIME_FORMAT = 'y-m-d H:i'
TIME_INPUT_FORMATS = ('%H:%M', '%H', '%H:%M:%S', '%H.%M')
FORM_RENDERER = 'django.forms.renderers.TemplatesSetting'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            path('templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'debug': DEBUG,
            'context_processors': [
                'apps.issues.context_processors.issues',
                'apps.contributors.context_processors.staff',
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'django.contrib.staticfiles.finders.FileSystemFinder',
]
WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': True,
        'BUNDLE_DIR_NAME': './',  # must end with slash
        'STATS_FILE': env.BUILD_DIR + 'webpack-stats.json',
    }
}

NOTEBOOK_ARGUMENTS = [
    '--no-browser', '--port=8888', '--ip=0.0.0.0', '--NotebookApp.token=""',
    '--NotebookApp.password="{}"'.format(env.NOTEBOOK_PASSWORD),
    '--notebook-dir',
    path('notebooks')
]
