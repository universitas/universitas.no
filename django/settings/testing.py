""" Settings for running tests """
from .base import *
import warnings

# IN-MEMORY TEST DATABASE
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
        "USER": "",
        "PASSWORD": "",
        "HOST": "",
        "PORT": "",
    },
}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# ignore the following error when using ipython:
#/django/db/backends/sqlite3/base.py:50: RuntimeWarning:
# SQLite received a naive datetime (2012-11-02 11:20:15.156506) while time zone support is active.

warnings.filterwarnings("ignore", category=RuntimeWarning, module='django.db.backends.sqlite3.base', lineno=63)
