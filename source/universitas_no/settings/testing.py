from universitas_no.settings.base import *

########## TEST SETTINGS
# TEST_RUNNER = 'discover_runner.DiscoverRunner'
# TEST_DISCOVER_TOP_LEVEL = SITE_ROOT
# TEST_DISCOVER_ROOT = SITE_ROOT
# TEST_DISCOVER_PATTERN = "test_*.py"
########## IN-MEMORY TEST DATABASE

STAGING='testing'

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
#ignore the following error when using ipython:
#/django/db/backends/sqlite3/base.py:50: RuntimeWarning:
#SQLite received a naive datetime (2012-11-02 11:20:15.156506) while time zone support is active.

import warnings
warnings.filterwarnings("ignore", category=RuntimeWarning, module='django.db.backends.sqlite3.base', lineno=63)