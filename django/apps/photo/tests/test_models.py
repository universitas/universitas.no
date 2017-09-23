from pathlib import PosixPath as Path

import pytest
from apps.photo.models import ImageFile
from django.core.files import File


@pytest.fixture
def fixture_image():
    img = Path(__file__).parent / 'fixtureimage.jpg'
    assert img.exists(), 'image not found'
    return str(img)


@pytest.mark.django_db
def test_image_hashes(fixture_image):
    """ Save an image file and calculate hash values """
    img = ImageFile()
    with open(fixture_image, 'rb') as fp:
        img.source_file.save('foobar.jpg', File(fp), save=False)
    assert img.full_width == 100
    assert img.full_height == 97
    assert img._md5 is None
    assert img._size is None
    assert img._mtime is None
    assert img._imagehash == ''
    img.calculate_hashes()
    assert img._md5[:5] == '44086'
    assert img._size == 2784
    assert img._mtime > 1000000000
    assert img._imagehash[:5] == '70b48'  # is string
    assert img.imagehash.hash.shape == (8, 8)  # is array
    assert img.pk is None  # did not save
    img.save()
    modified = img.modified
    assert not img.calculate_hashes()  # returns False
    assert img.modified == modified  # did not save
    img._md5 = None
    assert img.calculate_hashes()  # returns True
    assert img.modified > modified  # saved


@pytest.mark.django_db
def test_custom_field(fixture_image):
    img = ImageFile()
    assert img.cropping_method == img.CROP_PENDING
    assert img.crop_box.left < img.crop_box.right  # pylint: disable-all
    with open(fixture_image, 'rb') as fp:
        img.source_file.save('foobar.jpg', File(fp))
    img.crop_box.right = 5
    img.crop_box.top = -5
    img.crop_box.x = 1
    img.save()
    img.refresh_from_db()
    assert img.crop_box.right == 1
    assert img.crop_box.top == 0
    assert img.crop_box.x == 1
    img.crop_box.x = -5
    img.crop_box.y = 5
    img.save()
    img.refresh_from_db()
    # put x, y inside box
    assert img.crop_box.x == img.crop_box.left
    assert img.crop_box.y == img.crop_box.bottom
