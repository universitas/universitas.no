from sorl.thumbnail.engines.wand_engine import Engine as WandEngine
from .cropping.boundingbox import Box

import logging
logger = logging.getLogger(__name__)


def close_crop(x, y, left, right, top, bottom, aspect_ratio):
    l, r, t, b, A = left, right, top, bottom, aspect_ratio
    w, h = r - l, b - t
    a = w / h
    W = 0.5 * min(A, 1, w if a > A else h * A)
    H = W / A
    X, Y = [sorted(c)[1] for c in (
        ((W, (l + r) / 2, 1 - W), (l + W, x, r - W))[W * 2 < w],
        ((H, (t + b) / 2, 1 - H), (t + H, y, b - H))[H * 2 < h]
    )]
    return Box(X - W, Y - H, X + W, Y + H)


def calculate_crop(width, height, crop_width, crop_height, crop_box):
    aspect_ratio = (crop_width * height) / (crop_height * width)
    crop = close_crop(aspect_ratio=aspect_ratio, **crop_box)
    return Box(
        int(crop.left * width),
        int(crop.top * height),
        int(crop.right * width),
        int(crop.bottom * height),
    )


class CloseCropEngine(WandEngine):

    def create(self, image, geometry, options):
        cropbox = options.pop('crop_box', None)
        if cropbox:
            new_geometry = calculate_crop(
                image.width, image.height, geometry[0], geometry[1], cropbox)
            image.crop(*new_geometry)

        return super().create(image, geometry, options)
