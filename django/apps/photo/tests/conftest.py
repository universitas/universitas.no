"""Module scoped pytest fixtures"""
from pathlib import PosixPath as Path

import pytest
from apps.photo.models import ImageFile
from django.core.files import File
from sorl.thumbnail import default


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
        img.original.save('foobar.jpg', File(fp), save=False)
    yield img
    clear_thumbnail_cache()
