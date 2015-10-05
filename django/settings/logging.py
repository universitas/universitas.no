from .setting_helpers import environment_variable, join_path
__all__ = ['LOGGING']

LOG_FOLDER = join_path(environment_variable('SOURCE_FOLDER'), '..', 'logs')

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
    'verbose': {
        'format': (
            '%(asctime)s [%(levelname)5s] %(name)12s '
            '%(filename)12s:%(lineno)-4d '
            '(%(funcName)s)\n\t%(message)s\n'
        ),
        'datefmt': '%H:%M:%S %Y-%m-%d'
    },
    'simple': {
        'format': '%(name)s %(levelname)3s: %(message)s'
    },
    'minimal': {
        'format': '%(message)s'
    },
}
LOGGING['handlers'] = {
    'console': {
        'filters': ['require_debug_true'],
        'level': 'DEBUG',
        'class': 'logging.StreamHandler',
        'formatter': 'verbose',
    },
    'errorlog': {
        'filters': ['require_debug_false'],
        'filename': join_path(LOG_FOLDER, 'error_django.log'),
        'maxBytes': 1e6,  # 1 MB
        'backupCount': 10,
        'level': 'ERROR',
        'class': 'logging.handlers.RotatingFileHandler',
        'formatter': 'verbose',
    },
    'debuglog': {
        'filters': ['require_debug_true'],
        'filename': join_path(LOG_FOLDER, 'debug_django.log'),
        'maxBytes': 1e6,  # 1 MB
        'backupCount': 10,
        'level': 'DEBUG',
        'class': 'logging.handlers.RotatingFileHandler',
        'formatter': 'verbose',
    },
    'bylineslog': {
        'filename': join_path(LOG_FOLDER, 'bylines.log'),
        'level': 'DEBUG',
        'class': 'logging.FileHandler',
        'formatter': 'minimal',
    },
    'sentry': {
        'level': 'ERROR',
        # 'filters': ['require_debug_false'],
        'class': 'raven.contrib.django.raven_compat.handlers.SentryHandler',
    },
}
LOGGING['loggers'] = {
    'bylines': {
        'level': 'DEBUG', 'propagate': False,
        'handlers': ['bylineslog'],
    },
    'sorl.thumbnail': {
        'level': 'WARNING', 'propagate': False,
        'handlers': ['errorlog', 'debuglog'],
    },
}
LOGGING['root'] = {
    'level': "DEBUG",
    'handlers': [
        'console',
        'errorlog',
        'debuglog',
        'sentry'
    ],
}
