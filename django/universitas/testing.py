""" Settings for running tests """
from .base import *  # noqa

DEBUG = False
LOGGING = {}  # type: dict
PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
# MEDIA_ROOT = tempfile.mkdtemp(prefix='djangotest_')
# STATIC_ROOT = tempfile.mkdtemp(prefix='djangotest_')
THUMBNAIL_KEY_PREFIX = 'thumb_test'
DEFAULT_FILE_STORAGE = 'utils.local_file_storage.OverwriteStorage'
