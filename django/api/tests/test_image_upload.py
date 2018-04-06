import shutil
from pathlib import Path

import pytest
from apps.photo.models import ImageFile
from apps.stories.models import Section, Story, StoryType
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from rest_framework import status
from rest_framework.test import APIClient


@pytest.fixture
def editor(request):
    wyatt = get_user_model().objects.create_superuser(
        username='wyatt',
        email='wyatt@marshall.gov',
        password='gunsmoke',
    )
    return wyatt


@pytest.fixture
def api_user(request):
    user = get_user_model().objects.create_user(
        username='api',
        email='api@marshall.gov',
        password='api',
    )
    change = Permission.objects.get(codename='change_story')
    create = Permission.objects.get(codename='add_story')
    user.user_permissions.add(change, create)
    return user


@pytest.fixture
def news():
    try:
        return StoryType.objects.get(name='News')
    except StoryType.DoesNotExist:
        section = Section.objects.get_or_create(title='Foo')[0]
        return StoryType.objects.create(section=section, name='News')


@pytest.fixture
def scandal(news):
    story = Story.objects.create(
        story_type=news,
        working_title='A shocking scandal!',
    )
    return story


@pytest.fixture
def photo():
    source = Path(__file__).parent / 'dummy.jpg'
    shutil.copy(source, Path('/var/media/scandal.jpg'))
    return ImageFile.objects.create(source_file='scandal.jpg')


@pytest.mark.django_db
def test_get_story(scandal):
    api_url = '/api/legacy/'
    client = APIClient()
    response = client.get(api_url)
    stories = response.json().get('results')
    assert len(stories) == 1
    assert stories[0]['arbeidstittel'] == scandal.working_title
    assert stories[0]['bilete'] == []


@pytest.mark.django_db
def test_change_story(scandal, api_user):
    api_url = f'/api/legacy/{scandal.pk}/'
    text = 'A scandal rocks the university'
    client = APIClient()

    response = client.patch(api_url, data={'tekst': text})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

    login = client.login(username='api', password='api')
    assert login

    response = client.patch(api_url, data={'tekst': text})
    assert response.status_code == status.HTTP_200_OK

    scandal.refresh_from_db()
    assert scandal.bodytext_markup == text


@pytest.mark.django_db
def test_create_story(api_user, photo):
    api_url = '/api/legacy/'
    client = APIClient()
    client.login(username='api', password='api')
    response = client.post(
        api_url,
        format='json',
        data={
            'mappe': 'kultur',
            'tekst': 'test',
            'arbeidstittel': 'hello',
            'produsert': 1,
            'bilete': [
                {'bildefil': 'sandal.jpg', 'bildetekst': 'one'},
            ],
        }
    )
    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_update_photos(scandal, photo, api_user):
    api_url = f'/api/legacy/{scandal.pk}/'
    client = APIClient()
    client.login(username='api', password='api')
    data = {
        'bilete': [{'bildefil': 'scandal.jpg', 'bildetekst': 'one'},
                   {'bildefil': 'scandal.jpg', 'bildetekst': 'two'}]
    }
    response = client.patch(api_url, data=data, format='json')
    assert response.status_code == status.HTTP_200_OK
    captions = scandal.get_images().values_list('caption', flat=True)
    assert sorted(captions) == ['one', 'two']

    updated_data = client.get(api_url).json()
    assert updated_data['bilete'][0]['bildefil'] == 'scandal.jpg'
