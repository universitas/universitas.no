from pathlib import Path

import pytest
from apps.photo.models import ImageFile
from apps.photo.tasks import (autocrop_image_file, import_image,
                              post_save_task, update_image_descriptions)
from django.core.files import File


@pytest.mark.django_db
def test_update_descriptions():
    assert update_image_descriptions() == 0
    # Should probably add some tests for byline images etc, but I can't be
    # bothered to add imagefiles, contributors, stories and story image
    # fixtures


@pytest.mark.django_db
def test_post_save(jpeg_file):
    img = ImageFile()
    assert img.cropping_method == img.CROP_PENDING
    with jpeg_file.open('rb') as fp:
        img.original.save('foobar.jpg', File(fp))
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
    assert Path(imgfile.original.name).name == png_file.name

    # exists, but is smaller
    assert not import_image(jpeg_file)

    # should not import broken image
    assert not import_image(broken_image_file)
