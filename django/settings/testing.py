""" Settings for running tests """
from .base import *
import logging
logging.disable(logging.CRITICAL)
DATABASE_ROUTERS = []
del DATABASES['prodsys']
PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.MD5PasswordHasher',
)
