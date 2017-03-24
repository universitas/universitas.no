""" Settings for local development """

from .dev import *  # noqa
from .dev import (
    WEBPACK_LOADER, DEBUG, INSTALLED_APPS, MIDDLEWARE_CLASSES, DATABASES, env
)
DEFAULT_FROM_EMAIL = 'localemail@localhost'
# DATABASES['prodsys'].update({'HOST': 'localhost', })
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

RUNSERVERPLUS_SERVER_ADDRESS_PORT = '0.0.0.0:8000'
ALLOWED_HOSTS = '*'
# TOOLBAR CONFIGURATION
INSTALLED_APPS += ['debug_toolbar', ]
MIDDLEWARE_CLASSES += ['debug_toolbar.middleware.DebugToolbarMiddleware', ]

DEBUG_TOOLBAR_PATCH_SETTINGS = False

# Use File system in local development instead of Amanon S3
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
THUMBNAIL_STORAGE = DEFAULT_FILE_STORAGE
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

MEDIA_ROOT = env.MEDIA_DIR or '/media/'
STATIC_ROOT = env.STATIC_DIR or '/static/'
MEDIA_URL = '/media/'
STATIC_URL = '/static/'

if DEBUG:
    DEBUG_TOOLBAR_CONFIG = {
        "SHOW_TOOLBAR_CALLBACK": lambda request: True
    }

DATABASES['prodsys'] = {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': 'prodsys',
}

WEBPACK_LOADER['DEFAULT'].update({
    'CACHE': not DEBUG,
    'POLL_INTERVAL': 0.5,
    'TIMEOUT': None,
    # 'IGNORE': ['.+\.hot-update.js', '.+\.map']
})
