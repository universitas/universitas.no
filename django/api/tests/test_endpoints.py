import pytest
from rest_framework import status

endpoints = [
    'contributors',
    'frontpage',
    'photos',
    'issues',
    'legacy',
    'pdfs',
    'permissions',
    'stories',
    'storyimages',
    'storytypes',
]


@pytest.mark.parametrize('endpoint', endpoints)
def test_api_endpoint_exists(staff_client, endpoint):
    response = staff_client.get(f'/api/{endpoint}/')
    assert response.status_code == status.HTTP_200_OK
