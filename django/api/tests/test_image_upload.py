from io import BytesIO

from PIL import Image

import pytest
from apps.photo.models import ImageFile
from apps.stories.models import Section, Story, StoryType
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from rest_framework import status
from rest_framework.test import APIClient


@pytest.fixture
def deputy(request):
    user = get_user_model().objects.create_user(
        username='deputy',
        email='deputy@marshall.gov',
        password='howdypartner',
    )
    # change = Permission.objects.get(codename='change_story')
    # create = Permission.objects.get(codename='add_story')
    perms = 'add_story', 'change_story', 'add_imagefile', 'change_imagefile'
    user.user_permissions.add(*Permission.objects.filter(codename__in=perms))
    return user


def dummy_image(
    filename='dummy.png', size=(100, 100), color='white', mode='RGB'
):
    """Creates single color dummy image"""
    im = Image.new(mode, size, color)
    blob = BytesIO()
    format = 'png' if filename.endswith('png') else 'jpeg'
    im.save(blob, format)
    blob.seek(0)
    blob.name = filename
    return blob


@pytest.fixture
def client(request, deputy):
    client = APIClient()
    client.login(username='deputy', password='howdypartner')
    return client


@pytest.mark.django_db
def test_upload_list(client):
    """Listview returns empty list"""
    path = '/api/upload/'
    response = client.get(path)
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


@pytest.mark.django_db
def test_upload_image(client):
    """It is possible to upload an image"""
    response = client.post(
        '/api/upload/',
        data={
            'original': dummy_image('starwars.png'),
            'description': 'Star Wars!',
            'artist': 'George Lucas',
            'category': ImageFile.EXTERNAL,
        }
    )
    assert response.json()['created'] != ''
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
