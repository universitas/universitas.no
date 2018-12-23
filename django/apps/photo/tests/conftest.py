"""Module scoped pytest fixtures"""
from pathlib import PosixPath as Path

from django.core.files import File
import pytest
from sorl.thumbnail import default

from apps.photo.models import ImageFile


def clear_thumbnail_cache():
    """Clear all thumbnails from cache."""
    default.kvstore.clear()


@pytest.fixture(scope='module')
def jpeg_file():
    img = Path(__file__).parent / 'fixtureimage.jpg'
    assert img.exists(), 'image not found'
    return img


@pytest.fixture(scope='module')
def png_file():
    img = Path(__file__).parent / 'fixtureimage.png'
    assert img.exists(), 'image not found'
    return img


@pytest.fixture(scope='module')
def broken_image_file():
    img = Path(__file__).parent / 'fixtureimage.png.broken'
    assert img.exists(), 'image not found'
    return img


@pytest.fixture(scope='function')
def img(jpeg_file):
    img = ImageFile()
    with open(jpeg_file, 'rb') as fp:
        img.original.save(
            jpeg_file.name, File(fp, name=jpeg_file.name), save=False
        )
    print(img.original.file, jpeg_file.name)
    yield img
    clear_thumbnail_cache()
