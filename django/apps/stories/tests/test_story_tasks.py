import pytest

from apps.stories.models import Story
from apps.stories.tasks import upload_storyimages


@pytest.fixture
def story():
    return Story.objects.create(title='Story', lede='lorem ipsum')


@pytest.mark.django_db
def test_upload_task(story):
    assert 'Baksiden' in upload_storyimages(story.pk)
