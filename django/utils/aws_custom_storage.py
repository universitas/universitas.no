# -*- coding: utf-8 -*-
"""Custom overrides for the Amazon storage"""
from storages.backends.s3boto import S3BotoStorage, setting


class CustomS3BotoStorage(S3BotoStorage):
    cache_max_age = 0
    gzip = setting('AWS_IS_GZIPPED', True)
    # preload_metadata = setting('AWS_PRELOAD_METADATA', False)
    # gzip_content_types = setting('GZIP_CONTENT_TYPES', (
    #     'text/css',
    #     'text/javascript',
    #     'application/javascript',
    #     'application/x-javascript',
    # ))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.cache_max_age:
            self.headers.update({
                'Cache-Control': 'max-age={seconds}'.format(
                    seconds=self.cache_max_age)
            })


class StaticStorage(CustomS3BotoStorage):

    """Storage for static assets such as icons, fonts, css and js"""

    cache_max_age = 60 * 60 * 24 * 2
    location = 'static'

    # def url(self, relurl):
    #     return super().url(self.location + '/' + relurl)


class MediaStorage(CustomS3BotoStorage):

    """Storage for user uploaded images and files"""

    location = 'media'


class ThumbStorage(CustomS3BotoStorage):

    """Storage for thumbnails"""

    cache_max_age = 60 * 60 * 24 * 10000
    location = 'media'
