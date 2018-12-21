from rest_framework import status

api_url = '/api/storyimages/'


def test_api_endpoint_exists(staff_client):
    response = staff_client.get(api_url)
    assert response.status_code == status.HTTP_200_OK


def test_create_new_storyimage(staff_client, scandal, scandal_photo):
    """Can create new storyimage and patch it"""
    assert scandal.images.count() == 0
    data = {
        'parent_story': scandal.pk,
        'imagefile': scandal_photo.pk,
    }
    response = staff_client.post(api_url, data=data)

    assert response.status_code == status.HTTP_201_CREATED
    assert set(response.data) == {
        'url',
        'id',
        'caption',
        'parent_story',
        'imagefile',
        'creditline',
        'filename',
        'thumb',
        'size',
        'aspect_ratio',
        'crop_box',
        'ordering',
        'placement',
        'cropped',
    }
    assert scandal.images.count() == 1
    assert response.data.get('caption') == ''

    # update some fields.
    patch_data = {
        'caption': 'Scandal: This is shocking!', 'creditline': 'press photo'
    }
    response = staff_client.patch(response.data['url'], data=patch_data)
    assert response.status_code == status.HTTP_200_OK
    assert response.data['caption'] == patch_data['caption']

    # can filter results by parent story
    response = staff_client.get(api_url, data={'parent_story': scandal.pk})
    assert response.data.get('count') == 1  # the story image we created
    response = staff_client.get(api_url, data={'parent_story': scandal.pk + 1})
    assert response.data.get('count') == 0  # no other story images in db
