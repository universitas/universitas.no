"""Development settings and globals."""
from .base import *  # NOQA
# flake8: noqa F403
from .base import DEBUG, INSTALLED_APPS, MIDDLEWARE_CLASSES, WEBPACK_LOADER

ROOT_URLCONF = 'universitas.dev_urls'
RUNSERVERPLUS_SERVER_ADDRESS_PORT = '0.0.0.0:8000'
ALLOWED_HOSTS = '*'

# TOOLBAR CONFIGURATION
INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE_CLASSES += ['debug_toolbar.middleware.DebugToolbarMiddleware']
DEBUG_TOOLBAR_PATCH_SETTINGS = False

# TEMPLATES[0]['OPTIONS']['string_if_invalid'] = 'INVALID'  # type: ignore

DEBUG_TOOLBAR_CONFIG = {
    'DISABLE_PANELS': {
        'debug_toolbar.panels.redirects.RedirectsPanel',
        'debug_toolbar.panels.sql.SQLPanel',
        'debug_toolbar.panels.templates.TemplatesPanel',
        'debug_toolbar.panels.loggin.LoggingPanel',
    }, "SHOW_TOOLBAR_CALLBACK": lambda request: True
}

WEBPACK_LOADER['DEFAULT'].update({
    'CACHE': not DEBUG,
    'POLL_INTERVAL': 0.5,
    'TIMEOUT': None,
    # 'IGNORE': ['.+\.hot-update.js', '.+\.map']
})
