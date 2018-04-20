import pytest
from rest_framework import status
from rest_framework.test import APIClient

from apps.photo.models import ImageFile
from utils.testhelpers import dummy_image


@pytest.fixture
def staff_client(request, journalist):
    client = APIClient()
    client.login(username='journalist', password='howdypartner')
    yield client
    client.logout()


@pytest.mark.django_db
def test_upload_list(staff_client):
    """Listview returns empty list"""
    path = '/api/upload/'
    response = staff_client.get(path)
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


@pytest.mark.django_db
def test_upload_image(staff_client):
    """It is possible to upload an image"""
    response = staff_client.post(
        '/api/upload/',
        data={
            'original': dummy_image('starwars.png'),
            'description': 'Star Wars!',
            'artist': 'George Lucas',
            'category': ImageFile.EXTERNAL,
        }
    )
    if response.status_code != 201:
        print(response.content)
    assert response.status_code == status.HTTP_201_CREATED
    assert set(response.json().keys()) == {
        'id',
        'url',
        'original',
        'description',
        'artist',
        'category',
        'created',
    }
