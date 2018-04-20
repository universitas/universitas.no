from io import BytesIO

from PIL import Image


def dummy_image(
    filename='dummy.png', size=(100, 100), color='white', mode='RGB'
):
    """Creates single color dummy image"""
    im = Image.new(mode, size, color)
    blob = BytesIO()
    format = 'png' if filename.endswith('png') else 'jpeg'
    im.save(blob, format)
    blob.seek(0)
    blob.name = filename
    return blob
