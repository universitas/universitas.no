import pytest
from pathlib import Path
from apps.photo.tasks import post_save_task, new_staging_images
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
    post_save_task(img)
    assert img.cropping_method != img.CROP_PENDING

    # run again, to generate thumbnail
    post_save_task(img)
    thumb = img.thumb()
    assert '<img' in thumb
    assert 'admin/img/icon-no.svg' not in thumb
    preview = img.preview()
    assert '<img' in preview
    assert 'admin/img/icon-no.svg' not in preview


def test_new_staging_images():
    staging_dir, new_files = new_staging_images()
    assert len(new_files) == 0
    assert '/staging/IMAGES' in staging_dir
