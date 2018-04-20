import pytest
from rest_framework import status
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_get_story(scandal):
    """Client fetches story list from api"""
    api_url = '/api/legacy/'
    client = APIClient()
    response = client.get(api_url)
    stories = response.json().get('results')
    assert len(stories) == 1
    assert stories[0]['arbeidstittel'] == scandal.working_title
    assert stories[0]['bilete'] == []


@pytest.mark.django_db
def test_change_story_anon(scandal):
    """Must be logged in to change"""
    api_url = f'/api/legacy/{scandal.pk}/'
    text = 'A scandal rocks the university'
    client = APIClient()

    response = client.patch(api_url, data={'tekst': text})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_change_story(scandal, staff_client):
    """Logged in client can change."""
    api_url = f'/api/legacy/{scandal.pk}/'
    text = 'A scandal rocks the university'
    response = staff_client.patch(api_url, data={'tekst': text})
    if response.status_code != 200:
        print(response.content)
    assert response.status_code == status.HTTP_200_OK

    scandal.refresh_from_db()
    assert scandal.bodytext_markup == text


@pytest.mark.django_db
def test_create_story(staff_client, scandal_photo):
    """Client creates a new story from indesign(!)"""
    api_url = '/api/legacy/'
    response = staff_client.post(
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
def test_update_photos(scandal, scandal_photo, staff_client):
    """Client updates story images from indesign"""
    api_url = f'/api/legacy/{scandal.pk}/'
    data = {
        'bilete': [{'bildefil': 'scandal.jpg', 'bildetekst': 'one'},
                   {'bildefil': 'scandal.jpg', 'bildetekst': 'two'}]
    }
    response = staff_client.patch(api_url, data=data, format='json')
    assert response.status_code == status.HTTP_200_OK
    captions = scandal.images.values_list('caption', flat=True)
    assert sorted(captions) == ['one', 'two']

    updated_data = staff_client.get(api_url).json()
    assert updated_data['bilete'][0]['bildefil'] == 'scandal.jpg'
