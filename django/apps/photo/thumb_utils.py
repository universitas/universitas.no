from sorl.thumbnail.engines.wand_engine import Engine as WandEngine
# from sorl.thumbnail.engines.pil_engine import Engine as PilEngine
# from sorl.thumbnail.engines.convert_engine import Engine
import re
from PIL import Image


from sorl.thumbnail.base import ThumbnailBackend, EXTENSIONS
from sorl.thumbnail.conf import settings
from sorl.thumbnail.helpers import tokey, serialize
import os.path
import logging
logger = logging.getLogger(__name__)


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

        path = '{}/{}/{}'.format(key[:2], key[2:4], key)

        filename = '{prefix}{path}/{filename}.{ext}'.format(
            prefix=settings.THUMBNAIL_PREFIX,
            path=path,
            filename=filename,
            ext=EXTENSIONS[options['format']],
        )
        return filename


class CloseCropEngine(WandEngine):

    def create(self, image, geometry, options):
        if options.get('diameter'):
            image = self.close_crop(image, geometry, options)

        image = super().create(image, geometry, options)
        return image

    def close_crop(self, image, geometry, options):
        """ crop it close """
        # crop circle diameter in pixels
        org_width, org_height = size = image['size']
        filename = image['source']
        diameter = options['diameter'] * min(size) / 100 * 1.5
        crop = options['crop']
        if isinstance(crop, str) and '%' in crop:

            new_ratio = geometry[0] / geometry[1]
            if new_ratio > 1:
                # landscape
                width, height = diameter * new_ratio, diameter
            else:
                # portrait
                width, height = diameter, diameter / new_ratio

            # If the orinal image file is too small, it will not be close
            # cropped.
            if org_width > width and org_height > height:
                left, top = [int(match) for match in re.findall(r'\d+', crop)]
                left = left * org_width / 100
                top = top * org_height / 100

                crop_top = min(org_height - height, max(0, top - height / 2))
                crop_left = min(org_width - width, max(0, left - width / 2))
                crop_right = crop_left + width
                crop_bottom = crop_top + height

                new_geometry = [int(value) for value in (
                    crop_left, crop_top, crop_right, crop_bottom
                )]

                original = Image.open(filename)
                cropped = original.crop(new_geometry)
                cropped.thumbnail(geometry)
                cropped.save(filename, **options)
                image['size'] = geometry

        return image
