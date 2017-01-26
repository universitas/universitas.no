""" Settings for running tests """
from .local import *
import logging
logging.disable(logging.CRITICAL)
DATABASE_ROUTERS = []
del DATABASES['prodsys']
PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.MD5PasswordHasher',
)

# MEDIA_ROOT = tempfile.mkdtemp(prefix='djangotest_')
# STATIC_ROOT = tempfile.mkdtemp(prefix='djangotest_')
