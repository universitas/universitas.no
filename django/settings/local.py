""" Settings for local development """

from .dev import *  # noqa
from .dev import (
    DEBUG, PROJECT_DIR,
    INSTALLED_APPS, MIDDLEWARE_CLASSES,
    environment_variable, join_path
)

DEFAULT_FROM_EMAIL = 'localemail@localhost'
# DATABASES['prodsys'].update({'HOST': 'localhost', })
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

RUNSERVERPLUS_SERVER_ADDRESS_PORT = '0.0.0.0:8010'
# TOOLBAR CONFIGURATION
INSTALLED_APPS += ['debug_toolbar', ]
MIDDLEWARE_CLASSES += ['debug_toolbar.middleware.DebugToolbarMiddleware', ]

DEBUG_TOOLBAR_PATCH_SETTINGS = False
INTERNAL_IPS = environment_variable('DEBUG_TOOLBAR_INTERNAL_IPS').split(' ')

# Use File system in local development instead of Amanon S3
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
THUMBNAIL_STORAGE = DEFAULT_FILE_STORAGE
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

MEDIA_ROOT = join_path(PROJECT_DIR, 'media')
STATIC_ROOT = join_path(PROJECT_DIR, 'static')
MEDIA_URL = '/media/'
STATIC_URL = '/static/'

DEBUG_TOOLBAR_CONFIG = {
    "SHOW_TOOLBAR_CALLBACK": lambda request: True,
}

WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': not DEBUG,
        'BUNDLE_DIR_NAME': './',  # must end with slash
        'STATS_FILE': join_path(PROJECT_DIR, 'webpack-stats.json'),
        'POLL_INTERVAL': 0.1,
        'TIMEOUT': None,
        'IGNORE': ['.+\.hot-update.js', '.+\.map']
    }
}
