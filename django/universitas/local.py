""" Settings for local development """

from .dev import *  # noqa
from .dev import (
    DEBUG, INSTALLED_APPS, MIDDLEWARE_CLASSES, TEMPLATES, WEBPACK_LOADER, env
)
from .setting_helpers import Environment

DEFAULT_FROM_EMAIL = 'localemail@localhost'
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

RUNSERVERPLUS_SERVER_ADDRESS_PORT = '0.0.0.0:8000'
ALLOWED_HOSTS = '*'
# TOOLBAR CONFIGURATION
INSTALLED_APPS += [
    'debug_toolbar',
]
MIDDLEWARE_CLASSES += [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

DEBUG_TOOLBAR_PATCH_SETTINGS = False

STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'
STATIC_ROOT = env.STATIC_DIR or '/static/'
STATIC_URL = '/static/'

TEMPLATES[0]['OPTIONS']['string_if_invalid'] = 'INVALID'  # type: ignore

aws = Environment('AWS')
try:
    # AMAZON WEB SERVICES
    AWS_S3_SECURE_URLS = False
    AWS_S3_USE_SSL = False
    AWS_S3_HOST = aws.s3_host
    AWS_STORAGE_BUCKET_NAME = aws.storage_bucket_name
    AWS_ACCESS_KEY_ID = aws.access_key_id
    AWS_SECRET_ACCESS_KEY = aws.secret_access_key

    AWS_S3_CUSTOM_DOMAIN = '{bucket}.{domain}'.format(
        bucket=AWS_STORAGE_BUCKET_NAME,
        domain=AWS_S3_HOST.replace('s3.', 's3-website.'),
    )

    DEFAULT_FILE_STORAGE = 'utils.aws_custom_storage.MediaStorage'
    THUMBNAIL_STORAGE = 'utils.aws_custom_storage.ThumbStorage'

except AttributeError:
    # Use File system in local development instead of Amanon S3
    DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
    THUMBNAIL_STORAGE = 'utils.local_file_storage.OverwriteStorage'
    MEDIA_ROOT = env.MEDIA_DIR or '/media/'
    MEDIA_URL = '/media/'

if DEBUG:
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
