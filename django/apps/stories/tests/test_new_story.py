"""Tests for creating stories and parsing stuff"""

import pytest
from apps.markup.models import BlockTag
from apps.stories.models import Section, Story, StoryType
from apps.stories.models.sections import default_story_type


@pytest.fixture
def no_story_types():
    StoryType.objects.all().delete()
    Section.objects.all().delete()


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


@pytest.mark.django_db
def test_that_there_are_tags():
    tag_count = BlockTag.objects.count()
    assert tag_count == 20


@pytest.mark.django_db
def test_create_story_from_xtags():
    source = """
    @tit:Hello World!
    @ing:A test story for you
    @txt:This story will rock the world!
    """.strip()
    new_story = Story(
        bodytext_markup=source, publication_status=Story.STATUS_FROM_DESK
    )
    new_story.clean()
    new_story.save()

    assert new_story.title == 'Hello World!'
    assert new_story.lede == 'A test story for you'
    assert 'bodytext' in new_story.get_html()
