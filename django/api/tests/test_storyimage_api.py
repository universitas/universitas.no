import pytest
from rest_framework import status


@pytest.mark.django_db
def test_api_endpoint_exists(staff_client):
    api_url = '/api/storyimages/'
    response = staff_client.get(api_url)
    assert response.status_code == status.HTTP_200_OK
