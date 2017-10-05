from .setting_helpers import Environment

# GMAIL CONFIGURATION
gmail = Environment('GMAIL')

try:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = 'smtp.gmail.com'
    EMAIL_HOST_USER = gmail.user + '@gmail.com'
    EMAIL_HOST_PASSWORD = gmail.password
    EMAIL_PORT = 587
    EMAIL_USE_TLS = True
    DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

except AttributeError:  # could not find env variables
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    DEFAULT_FROM_EMAIL = 'website@localhost'
