from storages.backends.s3boto import S3BotoStorage
from django.conf import settings


class CustomS3BotoStorage(S3BotoStorage):
    pass
    # @property
    # def connection(self):
    #     if self._connection is None:
    #         self._connection = self.connection_class(
    #             self.access_key,
    #             self.secret_key,
    #             calling_format=self.calling_format,
    #             host=settings.AWS_S3_HOST)
    #     return self._connection


class StaticStorage(CustomS3BotoStorage):

    """Storage for static assets such as icons, fonts, css and js"""

    duration = 60 * 60 * 24
    location = settings.STATICFILES_LOCATION
    headers = {
        'Cache-Control': 'max-age={},public'.format(duration)
    }

class MediaStorage(CustomS3BotoStorage):

    """Storage for user uploaded images and files"""

    location = settings.MEDIAFILES_LOCATION


class ThumbStorage(CustomS3BotoStorage):

    """Storage for thumbnails"""

    duration = 60 * 60 * 24 * 10000
    location = settings.MEDIAFILES_LOCATION
    headers = {
        'Cache-Control': 'max-age={},public'.format(duration)
    }
