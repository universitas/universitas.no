from sorl.thumbnail.engines.convert_engine import Engine
import re
import logging
from PIL import Image
logger = logging.getLogger('universitas')


class CloseCropEngine(Engine):

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

            #ratio = org_width / org_height
            new_ratio = geometry[0] / geometry[1]
            if new_ratio > 1:
                # landscape
                width, height = diameter * new_ratio, diameter
            else:
                # portrait
                width, height = diameter, diameter / new_ratio

            if org_width > width and org_height > height:
                left, top = [int(match) for match in re.findall(r'\d+', crop)]
                left = left * org_width / 100
                top = top * org_height / 100
                print(top, left)
                crop_top = min(org_height - height, max(0, top - height / 2))
                crop_left = min(org_width - width, max(0, left - width / 2))
                crop_right = crop_left + width
                crop_bottom = crop_top + height

                new_geometry = [
                    int(value) for value in (
                        crop_left,
                        crop_top,
                        crop_right,
                        crop_bottom)]

                original = Image.open(filename)
                cropped = original.crop(new_geometry)
                cropped.thumbnail(geometry)
                cropped.save(filename, **options)
                image['size'] = geometry

        return image
