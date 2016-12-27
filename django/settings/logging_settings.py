# -*- coding: utf-8 -*-
"""Configurations for logging"""
from utils.setting_helpers import environment_variable, join_path
__all__ = ['LOGGING']

LOG_FOLDER = join_path(environment_variable('SOURCE_FOLDER'), '..', 'logs')


def logfile_handler(filename, debug=False, **kwargs):
    config = {
        'filename': join_path(LOG_FOLDER, filename),
        'filters': ['require_debug_true'] if debug else ['require_debug_false'],
        'level': 'DEBUG' if debug else 'WARNING',
        'class': 'logging.FileHandler',
        'formatter': 'verbose',
    }
    config.update(kwargs)
    return config

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
}
LOGGING['filters'] = {
    'require_debug_false': {
        '()': 'django.utils.log.RequireDebugFalse'
    },
    'require_debug_true': {
        '()': 'django.utils.log.RequireDebugTrue'
    }
}
LOGGING['formatters'] = {
    'minimal': {
        'format': '%(message)s'
    },
    'simple': {
        'format': '%(name)s %(levelname)3s: %(message)s'
    },
    'verbose': {
        'format': (
            '%(asctime)s [%(levelname)5s] %(name)12s '
            '%(filename)12s:%(lineno)-4d '
            '(%(funcName)s)\n\t%(message)s\n'
        ),
        'datefmt': '%H:%M:%S %Y-%m-%d'
    },
}
LOGGING['handlers'] = {
    'errorlog': logfile_handler('error-django.log'),
    'celerylog': logfile_handler('celery-django.log', debug=True),
    'debuglog': logfile_handler('debug-django.log', debug=True),
    'bylineslog': logfile_handler(
        'bylines.log', level='INFO', filters=[], formatter='minimal',),
    'sentry': {
        'level': 'ERROR',
        'filters': ['require_debug_false'],
        'class': 'raven.contrib.django.raven_compat.handlers.SentryHandler',
    },
    'console': {
        'filters': ['require_debug_true'],
        'level': 'DEBUG',
        'class': 'logging.StreamHandler',
        'formatter': 'verbose',
    },
}
LOGGING['root'] = {
    'level': 'WARNING',
    'handlers': ['console', 'errorlog', 'debuglog', 'sentry'],
}
LOGGING['loggers'] = {
    'bylines': {
        'level': 'INFO', 'propagate': False,
        'handlers': ['bylineslog'],
    },
    'sorl.thumbnail': {
        'level': 'WARNING', 'propagate': False,
        'handlers': ['errorlog', 'debuglog'],
    },
    'apps': {
        'level': 'DEBUG', 'propagate': False,
        'handlers': ['console', 'errorlog', 'debuglog', 'sentry'],
    },
    'core': {
        'level': 'DEBUG', 'propagate': False,
        'handlers': ['console', 'errorlog', 'debuglog', 'sentry'],
    },
    'celery': {
        'level': 'INFO', 'propagate': False,
        'handlers': ['console', 'celerylog', 'sentry'],
    },
}
