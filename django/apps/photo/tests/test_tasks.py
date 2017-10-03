import pytest
from apps.photo.models import ImageFile
from apps.photo.tasks import (
    autocrop_image_file, new_staging_images, post_save_task
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
    assert img._md5
    assert img._imagehash


def test_new_staging_images():
    # Doesn't raise
    assert new_staging_images() is not None
