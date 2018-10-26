""" Settings for running tests """
import tempfile

from .base import *  # noqa

DEBUG = False
LOGGING = {'version': 1, 'loggers': {'sorl.thumbnail': {'level': 'CRITICAL'}}}
PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
THUMBNAIL_KEY_PREFIX = 'thumb_test'
DEFAULT_FILE_STORAGE = 'utils.local_file_storage.OverwriteStorage'
FILE_UPLOAD_TEMP_DIR = tempfile.mkdtemp(prefix='djangotest_')
MEDIA_ROOT = tempfile.mkdtemp(prefix='djangotest_')
STATIC_ROOT = tempfile.mkdtemp(prefix='djangotest_')
