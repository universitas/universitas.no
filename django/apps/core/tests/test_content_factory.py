import pytest
from apps.core import content_factory
from apps.stories.models import Story


def test_random_image():
    image = content_factory.random_image(size=(50, 50))
    image2 = content_factory.random_image(size=(50, 50))

    assert image.size == (50, 50)
    assert image.getdata() != image2.getdata()


@pytest.mark.django_db
def test_fake_imagefile():
    image = content_factory.fake_imagefile()
    assert type(image).__name__ == 'ImageFile'


@pytest.mark.django_db
def test_fake_contributor():
    contributor = content_factory.fake_contributor()
    assert type(contributor).__name__ == 'Contributor'


def test_story_content():
    content = content_factory.fake_story_content()
    assert len(content) > 100
    assert '@tit:' in content


@pytest.mark.django_db
def test_fake_story():
    story = content_factory.fake_story()
    assert type(story) == Story
    assert Story.objects.count() == 1
