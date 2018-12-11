"""Tests for creating stories and parsing stuff"""

from io import BytesIO

from PIL import Image
import pytest

# from apps.markup.models import BlockTag
from apps.photo.models import ImageFile
from apps.stories.models import Byline, Section, Story, StoryImage, StoryType
from apps.stories.models.sections import default_story_type
from django.core.files.uploadedfile import SimpleUploadedFile


def image_data(size=(100, 100), mode='RGB', format='png', color='white'):
    """Creates binary file content of single color dummy image"""
    im = Image.new(mode, size, color)
    blob = BytesIO()
    im.save(blob, format)
    return blob.getvalue()


@pytest.fixture
def no_story_types():
    StoryType.objects.all().delete()
    Section.objects.all().delete()


@pytest.fixture
def dummy_image():
    return ImageFile.objects.create(
        original=SimpleUploadedFile(
            'dummy.jpg', image_data(format='jpeg', color='black')
        ),
        description='blackness',
    )


@pytest.fixture
def another_hope():
    story = Story(
        title='Another Hope',
        kicker='Episode IV',
        lede="""
        It is a period of civil war.
        Rebel spaceships, striking
        from a hidden base, have won
        their first victory against
        the evil Galactic Empire.
        """,
        bodytext_markup="""
        @txt:During the battle, Rebel
        spies managed to steal secret
        plans to the Empire's
        ultimate weapon, the DEATH
        STAR, an armored space
        station with enough power
        to destroy an entire planet.

        @txt:Pursued by the Empire's
        sinister agents, Princess
        Leia races home aboard her
        starship, custodian of the
        stolen plans that can save her
        people and restore
        freedom to the galaxy....
        """
    )
    story.save()
    Byline.create('text: George Lucas, film director', story)
    return story


@pytest.mark.django_db
def test_fixture(another_hope, dummy_image):
    """Fixture story with fixture story image."""
    another_hope.publication_status = Story.STATUS_FROM_DESK
    another_hope.clean()
    another_hope.save()
    StoryImage.objects.create(
        imagefile=dummy_image,
        parent_story=another_hope,
        caption='Dark: total blackness',
        creditline='created by the universe',
    )
    another_hope.refresh_from_db()
    assert another_hope.byline_set.count() == 1
    assert another_hope.images.count() == 1


@pytest.mark.django_db
def test_that_db_is_empty(no_story_types):
    """There should be no content"""
    assert Story.objects.count() == 0
    assert Section.objects.count() == 0
    assert StoryType.objects.count() == 0

    # create one section and story type
    default_story_type()
    assert Section.objects.count() == 1
    assert StoryType.objects.count() == 1


@pytest.mark.django_db
def test_new_story(no_story_types):
    """It's possible to create an empty story"""
    story = Story.objects.create()
    assert story.pk
    assert story.get_html() == ''
    assert story.get_absolute_url() == f'/{story.section}/{story.pk}/'


@pytest.mark.django_db
def test_new_story_type():
    """It's possible to create an empty story"""
    stype = StoryType.objects.create(name='Test Story Type')
    assert stype.slug == 'test-story-type'
