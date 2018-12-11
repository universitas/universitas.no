""" Tests for exif library """
import pytest

from apps.photo.file_operations import (
    get_exif,
    get_filesize,
    get_imagehashes,
    get_md5,
    get_mimetype,
    get_mtime,
    valid_image,
)
from django.core.files import File as DjangoFile


@pytest.fixture(params=range(5))
def file(request, jpeg_file):
    return [
        jpeg_file,
        str(jpeg_file),
        jpeg_file.read_bytes(),
        jpeg_file.open('rb'),
        DjangoFile(jpeg_file.open('rb'), 'jpeg.jpeg'),
    ][request.param]


def test_get_md5(file):
    val = get_md5(file)
    assert len(val) == 32


def test_get_filesize(file):
    # same bit size for all methods
    assert get_filesize(file) == 2966


def test_get_imagehash(file):
    for key, val in get_imagehashes(file).items():
        assert len(str(val)) == 16, f'imagehash: {key}'


def test_get_exif(file):
    val = get_exif(file)
    assert len(val) == 5


def test_get_mtime(jpeg_file):
    # timestamp value is large
    assert get_mtime(jpeg_file) > 15e8


def test_get_mimetype(jpeg_file, png_file, broken_image_file):
    assert get_mimetype(jpeg_file) == 'image/jpeg'
    assert get_mimetype(png_file) == 'image/png'
    assert get_mimetype(broken_image_file) == 'image/png'


def test_valid_image(jpeg_file, png_file, broken_image_file):
    assert valid_image(jpeg_file)
    assert valid_image(png_file)
    assert not valid_image(broken_image_file)
    assert not valid_image('abc')
    assert not valid_image(jpeg_file.parent)
