""" Settings for local development """

from .dev import *

DEFAULT_FROM_EMAIL = 'localemail@localhost'
DATABASES['prodsys'].update({'HOST': 'localhost', })
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# TOOLBAR CONFIGURATION
INSTALLED_APPS += ['debug_toolbar', ]
MIDDLEWARE_CLASSES += ['debug_toolbar.middleware.DebugToolbarMiddleware', ]

DEBUG_TOOLBAR_PATCH_SETTINGS = False
INTERNAL_IPS = environment_variable('DEBUG_TOOLBAR_INTERNAL_IPS').split(' ')
