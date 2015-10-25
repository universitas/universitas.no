""" Settings for local development """

from .dev import *

DEFAULT_FROM_EMAIL = 'localemail@localhost'
DATABASES['prodsys'].update({'HOST': 'localhost', })
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

RUNSERVERPLUS_SERVER_ADDRESS_PORT = 'localhost:8010'
# TOOLBAR CONFIGURATION
INSTALLED_APPS += ['debug_toolbar', ]
MIDDLEWARE_CLASSES += ['debug_toolbar.middleware.DebugToolbarMiddleware', ]

DEBUG_TOOLBAR_PATCH_SETTINGS = False
INTERNAL_IPS = environment_variable('DEBUG_TOOLBAR_INTERNAL_IPS').split(' ')

# Use File system in local development instead of Amanon S3
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
THUMBNAIL_STORAGE = DEFAULT_FILE_STORAGE
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

MEDIA_ROOT = join_path(PROJECT_DIR, MEDIA_ROOT)
STATIC_ROOT = join_path(PROJECT_DIR, STATIC_ROOT)
MEDIA_URL = '/media/'
STATIC_URL = '/static/'
