from sorl.thumbnail.base import ThumbnailBackend, EXTENSIONS
from sorl.thumbnail.conf import settings
from sorl.thumbnail.helpers import tokey, serialize
import os.path


class KeepNameThumbnailBackend(ThumbnailBackend):

    def _get_thumbnail_filename(self, source, geometry_string, options):
        """
        Computes the destination filename.
        """
        key = tokey(
            source.key,
            geometry_string,
            serialize(options)
        )

        filename, _ext = os.path.splitext(
            os.path.basename(source.name)
        )

        cache_path = '{}/{}/{}'.format(key[:2], key[2:4], key)

        filename = '{prefix}{cache_path}/{filename}.{ext}'.format(
            prefix=settings.THUMBNAIL_PREFIX,
            cache_path=cache_path,
            filename=filename,
            ext=EXTENSIONS[options['format']],
        )
        return filename
