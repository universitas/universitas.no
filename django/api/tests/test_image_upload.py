from rest_framework import status

from apps.photo.models import ImageFile
from utils.testhelpers import dummy_image

api_path = '/api/upload/'


def test_upload_list(staff_client):
    """Listview does not support GET"""
    response = staff_client.get(api_path)
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


def test_upload_image(staff_client, writer):
    """It is possible to upload an image file"""
    data = {
        'original': dummy_image('starwars.png'),
        'description': 'Star Wars!',
        'contributor': writer.pk,
        'category': ImageFile.EXTERNAL,
    }
    response = staff_client.post(api_path, data=data)  # multipart content

    assert response.status_code == status.HTTP_201_CREATED
    # api returns a json object with these keys
    assert set(response.data) == {
        'id',
        'url',
        'filename',
        'original',
        'description',
        'artist',
        'category',
        'created',
        'contributor',
    }
