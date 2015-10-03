from .setting_helpers import environment_variable, join_path
LOG_FOLDER = join_path(environment_variable('SOURCE_FOLDER'), '..', 'logs')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
}
LOGGING['formatters'] = {
    'verbose': {
        'format': '%(name)s%(levelname)6s %(filename)25s:%(lineno)-4d (%(funcName)s) - %(message)s'
    },
    'simple': {
        'format': '%(levelname)s %(message)s'
    },
    'minimal': {
        'format': '%(message)s'
    },
}
LOGGING['handlers'] = {
    'mail_admins': {
        'level': 'ERROR',
        'class': 'django.utils.log.AdminEmailHandler',
    },
    'stream_to_console': {
        'level': 'DEBUG',
        'class': 'logging.StreamHandler',
        'formatter': 'verbose',
    },
    'file': {
        'level': 'WARNING',
        'class': 'logging.FileHandler',
        'filename': join_path(LOG_FOLDER, 'django.log'),
        'formatter': 'verbose',
    },
    'bylines_file': {
        'level': 'DEBUG',
        'class': 'logging.FileHandler',
        'filename': join_path(LOG_FOLDER, 'bylines.log'),
        'formatter': 'minimal',
    },
}
LOGGING['loggers'] = {
    'django.request': {
        'level': 'DEBUG', 'propagate': True,
        'handlers': ['mail_admins', 'stream_to_console'],
    },
    'universitas': {
        'level': 'DEBUG', 'propagate': False,
        'handlers': ['stream_to_console', 'file', ],
    },
    'bylines': {
        'level': 'DEBUG', 'propagate': False,
        'handlers': ['bylines_file'],
    },
    'sorl.thumbnail': {
        'level': 'ERROR', 'propagate': False,
        'handlers': ['file'],
    },
}
