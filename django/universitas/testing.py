""" Settings for running tests """
from .local import *  # NOQA

DEBUG = False
LOGGING = {}  # type: dict
PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']

# MEDIA_ROOT = tempfile.mkdtemp(prefix='djangotest_')
# STATIC_ROOT = tempfile.mkdtemp(prefix='djangotest_')
