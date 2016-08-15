"""Development settings and globals."""

from .base import *  # NOQA

DEBUG = True
THUMBNAIL_DEBUG = True
ROOT_URLCONF = 'core.dev_urls'

# EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = environment_variable('DEV_GMAIL_USER') + '@gmail.com'
EMAIL_HOST_PASSWORD = environment_variable('DEV_GMAIL_PASSWORD')
EMAIL_PORT = 587
EMAIL_USE_TLS = True

NOTEBOOK_ARGUMENTS = [
    '--no-browser',
    '--port=8888',
    '--notebook-dir',
    join_path(PROJECT_DIR, 'notebooks')
]
