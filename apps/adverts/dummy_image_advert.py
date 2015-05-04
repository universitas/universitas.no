""" Dummy advert jpg generation. """
import io
import os
import random
from PIL import Image, ImageEnhance, ImageDraw, ImageFont
from colorsys import hls_to_rgb
from django.core.files.uploadedfile import InMemoryUploadedFile

FONT_FILE = os.path.join(os.path.dirname(__file__), 'arial.ttf')

def dummy_image_advert(width, height, watermarktext, labeltext):
    """ Create a dummy image ad that can be used for testing purposes """
    img = Image.new('RGB', (width, height), color=random_color())
    mark = create_watermark(watermarktext, angle=10, thumb_size=(100, 100))
    label = create_watermark(labeltext, thumb_size=(width, height))
    img = watermark(img, mark, 'tile', 0.4)
    img = watermark(img, label, (0, 0), 1)

    img_io = io.BytesIO()
    img.save(img_io, format='JPEG')
    filename = '{name:_<18}{w}x{h}.jpg'.format(
        name=labeltext,
        w=width,
        h=height).replace(
        ' ',
        '-').lower()
    # print(filename)

    django_file = InMemoryUploadedFile(
        file=img_io,
        field_name=None,
        name=filename,
        content_type='image/jpeg',
        size=len(img_io.getvalue()),
        charset=None
    )
    return django_file


def random_color():
    """ generate random rgb color as tuple of tree integers between 0-255 """
    hue = random.randint(0, 256) / 256
    lightness = random.randint(100, 150) / 256
    saturation = random.randint(50, 220) / 256
    rgb = tuple(int(value * 256)
                for value in hls_to_rgb(hue, lightness, saturation))
    return rgb


def create_watermark(text='xxx', angle=0, thumb_size=(50, 50)):
    """ Create a PIL.Image containing text on transparent background """
    font = ImageFont.truetype(FONT_FILE, 50)
    img = Image.new('RGBA', font.getsize(text), (0, 0, 0, 0))
    drawing = ImageDraw.Draw(img)
    drawing.text((0, 0), text, font=font, fill='white')
    img = img.rotate(angle=angle, expand=1, resample=Image.BICUBIC)
    img.thumbnail(thumb_size)
    return img


def reduce_opacity(im, opacity):
    """Returns an image with reduced opacity."""
    assert opacity >= 0 and opacity <= 1
    if im.mode != 'RGBA':
        im = im.convert('RGBA')
    else:
        im = im.copy()
    alpha = im.split()[3]
    alpha = ImageEnhance.Brightness(alpha).enhance(opacity)
    im.putalpha(alpha)
    return im


def watermark(img, mark, position, opacity=1):
    """Adds a watermark to an image."""
    if opacity < 1:
        mark = reduce_opacity(mark, opacity)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    # create a transparent layer the size of the image and draw the
    # watermark in that layer.
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    if position == 'tile':
        for y in range(0, img.size[1], mark.size[1]):
            for x in range(0, img.size[0], mark.size[0]):
                layer.paste(mark, (x, y))
    elif position == 'scale':
        # scale, but preserve the aspect ratio
        ratio = min(
            img.size[0] / mark.size[0],
            img.size[1] / mark.size[1]
        )
        w = int(mark.size[0] * ratio)
        h = int(mark.size[1] * ratio)
        mark = mark.resize((w, h))
        layer.paste(mark, ((img.size[0] - w) // 2, (img.size[1] - h) // 2))
    else:
        layer.paste(mark, position)
    # composite the watermark with the layer
    return Image.composite(layer, img, layer)
