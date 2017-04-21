import pytest
from pathlib import Path
from django.core.exceptions import ValidationError
from apps.photo.models import ImageFile
from django.core.files import File
from django.db import transaction


@pytest.fixture
def fixture_image():
    img = Path(__file__).parent / 'fixtureimage.jpg'
    assert img.exists(), 'image not found'
    return str(img)


@pytest.mark.django_db
def test_custom_field(fixture_image):
    img = ImageFile()
    assert img.cropping_method == img.CROP_PENDING
    assert img.crop_box.left < img.crop_box.right
    with open(fixture_image, 'rb') as fp:
        img.source_file.save('foobar.jpg', File(fp))
    img.crop_box.left = 5
    with pytest.raises(ValidationError):
        with transaction.atomic():
            img.save()
    img2 = ImageFile.objects.get(pk=img.pk)
    assert img2.crop_box.left == 0


