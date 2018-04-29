from rest_framework import status
from rest_framework.test import APIClient

api_url = '/api/legacy/'


def test_indesign_get_stories(scandal):
    """Unauthenticated user can GET a list of stories."""
    response = APIClient().get(api_url)
    stories = response.data.get('results')
    assert len(stories) == 1
    assert stories[0]['arbeidstittel'] == scandal.working_title
    assert stories[0]['bilete'] == []


def test_indesign_patch_anonymous(scandal):
    """Must be logged in to submit a PATCH."""
    data = {'tekst': 'A scandal rocks the university'}
    url = f'{api_url}{scandal.pk}/'
    response = APIClient().patch(url, data=data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_indesign_patch_story(scandal, staff_client):
    """Logged in client can submit a PATCH"""
    data = {'tekst': 'A scandal rocks the university'}
    url = f'{api_url}{scandal.pk}/'
    response = staff_client.patch(url, format='json', data=data)
    assert response.status_code == status.HTTP_200_OK

    # patch was stored in the db
    scandal.refresh_from_db()
    assert scandal.bodytext_markup == data['tekst']


def test_indesign_create_story(staff_client, scandal_photo):
    """Client creates a new story from indesign with POST"""
    data = {
        'mappe': 'kultur',
        'tekst': 'test',
        'arbeidstittel': 'hello',
        'produsert': 1,
        'bilete': [{'bildefil': 'scandal.jpg', 'bildetekst': 'one'}],
    }
    response = staff_client.post(api_url, format='json', data=data)
    assert response.status_code == status.HTTP_201_CREATED


def test_indesign_update_photos(scandal, scandal_photo, staff_client):
    """Client updates story images from indesign"""
    data = {'bilete': [
        {'bildefil': 'scandal.22.jpg', 'bildetekst': 'one'},
    ]}
    url = f'{api_url}{scandal.pk}/'
    response = staff_client.patch(url, format='json', data=data)
    assert response.status_code == status.HTTP_200_OK

    captions = scandal.images.values_list('caption', flat=True)
    assert sorted(captions) == ['one']

    updated_data = staff_client.get(url).data
    assert updated_data['bilete'][0]['bildefil'] == 'scandal.22.jpg'
