"""Production settings and globals."""

from .base import *  # noqa
from .setting_helpers import Environment

aws = Environment('AWS')
gmail = Environment('GMAIL')

# DEBUG CONFIGURATION
DEBUG = False
THUMBNAIL_DEBUG = DEBUG

# EMAIL CONFIGURATION
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = gmail.user + '@gmail.com'
EMAIL_HOST_PASSWORD = gmail.password
EMAIL_PORT = 587
EMAIL_USE_TLS = True

# AMAZON WEB SERVICES
STATICFILES_STORAGE = 'utils.aws_custom_storage.StaticStorage'
DEFAULT_FILE_STORAGE = 'utils.aws_custom_storage.MediaStorage'
THUMBNAIL_STORAGE = 'utils.aws_custom_storage.ThumbStorage'

AWS_STORAGE_BUCKET_NAME = aws.storage_bucket_name
AWS_ACCESS_KEY_ID = aws.access_key_id
AWS_SECRET_ACCESS_KEY = aws.secret_access_key

AWS_S3_HOST = 's3.eu-central-1.amazonaws.com'
AWS_S3_CUSTOM_DOMAIN = AWS_STORAGE_BUCKET_NAME  # cname
AWS_S3_SECURE_URLS = False
AWS_S3_USE_SSL = False

# AWS_S3_FILE_BUFFER_SIZE = 5242880
# Buffer size is used to calculate md5 hash for AWS mulitpart uploads
# if changed, md5 hashes for large files might be wrong

STATIC_URL = "http://{host}/{static}/".format(
    host=AWS_S3_CUSTOM_DOMAIN, static='static', )

MEDIA_URL = "http://{host}/{media}/".format(
    host=AWS_S3_CUSTOM_DOMAIN, media='media', )
