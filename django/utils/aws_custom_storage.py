from storages.backends.s3boto import S3BotoStorage
from django.conf import settings

class CustomS3BotoStorage(S3BotoStorage):

    @property
    def connection(self):
        if self._connection is None:
            self._connection = self.connection_class(
                self.access_key,
                self.secret_key,
                calling_format=self.calling_format,
                host=settings.AWS_S3_HOST)
        return self._connection


class StaticStorage(CustomS3BotoStorage):
    location = settings.STATICFILES_LOCATION


class MediaStorage(CustomS3BotoStorage):
    location = settings.MEDIAFILES_LOCATION
