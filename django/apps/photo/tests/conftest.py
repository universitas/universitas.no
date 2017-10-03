"""Module scoped pytest fixtures"""
from pathlib import PosixPath as Path

import pytest
from apps.photo.models import ImageFile
from django.core.files import File


@pytest.fixture(scope='module')
def jpeg_file():
    img = Path(__file__).parent / 'fixtureimage.jpg'
    assert img.exists(), 'image not found'
    return img


@pytest.fixture(scope='function')
def img(jpeg_file):
    img = ImageFile()
    with open(jpeg_file, 'rb') as fp:
        img.source_file.save('foobar.jpg', File(fp), save=False)
    return img
