from pathlib import Path

import pytest

from apps.photo.models import ImageFile
from apps.photo.tasks import (
    autocrop_image_file, import_image, new_staging_images, post_save_task
)
from django.core.files import File


@pytest.mark.django_db
def test_post_save(jpeg_file):
    img = ImageFile()
    assert img.cropping_method == img.CROP_PENDING
    with jpeg_file.open('rb') as fp:
        img.source_file.save('foobar.jpg', File(fp))
    autocrop_image_file(img.pk)
    img.refresh_from_db()
    assert img.cropping_method != img.CROP_PENDING

    # run again, to generate thumbnail
    post_save_task(img.pk)
    assert '.jpg' in img.small.url
    assert '.jpg' in img.large.url
    img.refresh_from_db()
    assert img.stat.get('md5')
    assert img._imagehash


def test_new_staging_images():
    # Doesn't raise
    assert new_staging_images() is not None


@pytest.mark.django_db
def test_import_images(jpeg_file, png_file, broken_image_file):
    assert ImageFile.objects.count() == 0

    assert import_image(jpeg_file)

    # already exists, so it's not saved
    assert not import_image(jpeg_file)
    assert ImageFile.objects.count() == 1

    # exists, but is larger
    assert import_image(png_file)
    assert ImageFile.objects.count() == 1
    imgfile = ImageFile.objects.first()
    assert Path(imgfile.source_file.name).name == png_file.name

    # exists, but is smaller
    assert not import_image(jpeg_file)

    # should not import broken image
    assert not import_image(broken_image_file)
