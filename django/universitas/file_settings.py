"""Production settings and globals."""

from .setting_helpers import Environment

env = Environment(strict=False)

MEDIA_ROOT = env.MEDIA_DIR or '/var/media/'
STATIC_ROOT = env.STATIC_DIR or '/var/static/'
STAGING_ROOT = env.STAGING_DIR or '/var/staging/'
FILE_UPLOAD_TEMP_DIR = STAGING_ROOT

# Use temporary file upload handler to do some queued local operations before
# saving files to the remote server.
FILE_UPLOAD_HANDLERS = [
    "django.core.files.uploadhandler.TemporaryFileUploadHandler"
]
FILE_UPLOAD_DIRECTORY_PERMISSIONS = 0o6770
FILE_UPLOAD_PERMISSIONS = 0o664
# FILE_UPLOAD_MAX_MEMORY_SIZE = 1000000  # 1 megabyte

MEDIA_URL = '/media/'
STATIC_URL = '/static/'

if env.digitalocean_enabled:
    # DIGITAL OCEAN SPACES
    aws = Environment('AWS')
    AWS_STORAGE_BUCKET_NAME = aws.storage_bucket_name
    AWS_ACCESS_KEY_ID = aws.access_key_id
    AWS_SECRET_ACCESS_KEY = aws.secret_access_key
    AWS_S3_ENDPOINT_URL = aws.s3_endpoint_url

    AWS_DEFAULT_ACL = 'public-read'
    AWS_QUERYSTRING_AUTH = False
    AWS_S3_FILE_OVERWRITE = True
    AWS_S3_REGION_NAME = 'ams3'
    AWS_S3_HOST = 'digitaloceanspaces.com'
    AWS_S3_CUSTOM_DOMAIN = (
        f'{AWS_STORAGE_BUCKET_NAME}.{AWS_S3_REGION_NAME}'
        '.cdn.digitaloceanspaces.com'
    )
    MEDIA_URL = f'https://{AWS_STORAGE_BUCKET_NAME}/media/'
    STATICFILES_STORAGE =\
        'django.contrib.staticfiles.storage.StaticFilesStorage'
    DEFAULT_FILE_STORAGE = 'utils.aws_custom_storage.MediaStorage'
    THUMBNAIL_STORAGE = 'utils.aws_custom_storage.ThumbStorage'
else:
    # Defaults for development and testing
    DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
    STATICFILES_STORAGE =\
        'django.contrib.staticfiles.storage.StaticFilesStorage'
    THUMBNAIL_STORAGE = 'utils.local_file_storage.OverwriteStorage'
