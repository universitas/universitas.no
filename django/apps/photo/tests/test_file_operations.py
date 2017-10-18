""" Tests for exif library """
import pytest
from apps.photo.file_operations import (
    get_exif, get_filesize, get_imagehash, get_md5, get_mtime
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
    val = get_imagehash(file)
    assert len(str(val)) == 16


def test_get_exif(file):
    val = get_exif(file)
    assert len(val) == 5


def test_get_mtime(jpeg_file):
    # timestamp value is large
    assert get_mtime(jpeg_file) > 15e8
