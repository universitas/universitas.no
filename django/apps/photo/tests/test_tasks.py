import pytest
from pathlib import Path
from apps.photo.tasks import autocrop_image_file, new_staging_images, post_save_task
from apps.photo.models import ImageFile
from django.core.files import File


@pytest.fixture
def fixture_image():
    img = Path(__file__).parent / 'fixtureimage.jpg'
    assert img.exists(), 'image not found'
    return str(img)


@pytest.mark.django_db
def test_post_save(fixture_image):
    img = ImageFile()
    assert img.cropping_method == img.CROP_PENDING
    with open(fixture_image, 'rb') as fp:
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
    staging_dir, new_files = new_staging_images()
    assert len(new_files) == 0
    assert '/staging/IMAGES' in staging_dir
