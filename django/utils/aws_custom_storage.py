"""Custom overrides for the Amazon storage"""
from storages.backends.s3boto3 import S3Boto3Storage


class CustomS3BotoStorage(S3Boto3Storage):
    cache_max_age = 0

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.cache_max_age:
            self.object_parameters = super().object_parameters.copy()
            self.object_parameters.update({
                'CacheControl': f'max-age={self.cache_max_age}'
            })


class StaticStorage(CustomS3BotoStorage):
    """Storage for static assets such as icons, fonts, css and js"""

    cache_max_age = 60 * 60 * 24 * 2
    location = 'static'


class MediaStorage(CustomS3BotoStorage):
    """Storage for user uploaded images and files"""

    location = 'media'


class ThumbStorage(CustomS3BotoStorage):
    """Storage for thumbnails"""

    cache_max_age = 60 * 60 * 24 * 10000
    location = 'media'
