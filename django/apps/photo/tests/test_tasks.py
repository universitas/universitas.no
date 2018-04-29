import pytest

from apps.photo.models import ImageFile
from apps.photo.tasks import (
    autocrop_image_file, post_save_task, update_image_descriptions
)
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
