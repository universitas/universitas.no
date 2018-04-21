from rest_framework import status

api_url = '/api/frontpage/'


def test_api_endpoint_exists(staff_client):
    response = staff_client.get(api_url)
    assert response.status_code == status.HTTP_200_OK
