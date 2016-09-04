"""Tests for creating stories and parsing stuff"""

import pytest
from apps.stories.models import (
    Story, StoryType, Section)
from apps.markup.models import BlockTag


# @pytest.fixture(scope='session')
# def django_db_setup(django_db_setup, django_db_blocker):
#     with django_db_blocker.unblock():
#         news = StoryType.objects.create('News')
#         # call_command('loaddata', 'your_data_fixture.json')

@pytest.fixture
def news():
    section = Section.objects.create()
    news = StoryType.objects.create(section=section, name='News')
    return news


@pytest.mark.django_db
def test_that_db_is_empty():
    """There should be no content"""
    assert Section.objects.count() == 0
    assert Story.objects.count() == 0
    assert StoryType.objects.count() == 0


@pytest.mark.django_db
def test_new_story(news):
    """It's possible to create an empty story"""
    empty_story = Story(story_type=news)
    empty_story.save()
    assert empty_story.id is not None
    html = empty_story.get_html()
    assert len(html) > 0


@pytest.mark.django_db
def test_create_story_from_xtags(news):
    source = """
    @tit:Hello World!
    @ing:A test story for you
    @txt:This story will rock the world!
    """
    new_story = Story(
        story_type=news,
        bodytext_markup=source,
    )
    tag_count = BlockTag.objects.count()
    assert tag_count == 20
    new_story.clean()
    new_story.save()

    assert new_story.title == 'Hello World!'
    assert new_story.lede == 'A test story for you'
    assert 'bodytext' in new_story.get_html()
