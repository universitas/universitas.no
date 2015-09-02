""" Django settings for testing. Using some tricks to speed up things. """
from universitas_no.settings.base import *
# import os
# TEST SETTINGS
# TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'
TEST_RUNNER = 'utils.fast_test_runner.FastTestRunner'
# TEST_DISCOVER_TOP_LEVEL = SITE_ROOT
# TEST_DISCOVER_ROOT = SITE_ROOT
# TEST_DISCOVER_PATTERN = "test_*.py"


# Speed up password hashing during testing.
PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.MD5PasswordHasher',
)
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

    # 'prodsys': {
    #     "ENGINE": "django.db.backends.sqlite3",
    #     "NAME": ":memory:",
    #     "USER": "",
    #     "PASSWORD": "",
    #     "HOST": "",
    #     "PORT": "",
    # },
}

# ignore the following error when using ipython:
#/django/db/backends/sqlite3/base.py:50: RuntimeWarning:
# SQLite received a naive datetime (2012-11-02 11:20:15.156506) while time zone support is active.

import warnings
warnings.filterwarnings("ignore", category=RuntimeWarning, module='django.db.backends.sqlite3.base', lineno=63)
