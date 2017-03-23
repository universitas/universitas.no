"""Development settings and globals."""

from .base import *  # NOQA
from .setting_helpers import Environment, joinpath as path

THUMBNAIL_DEBUG = DEBUG
ROOT_URLCONF = 'universitas.dev_urls'

# EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

gmail = Environment('GOOGLE', strict=False)
EMAIL_HOST_USER = (gmail.user or 'foobar') + '@gmail.com'
EMAIL_HOST_PASSWORD = gmail.password or 'password'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True

NOTEBOOK_ARGUMENTS = [
    '--no-browser',
    '--port=8888',
    '--ip=0.0.0.0',
    '--NotebookApp.token=""',
    '--NotebookApp.password=""',
    '--notebook-dir',
    path('notebooks')
]
