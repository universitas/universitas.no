import pytest
from apps.prodsys.models import (
    ProdStory, StoryPatch  # , ProdImage, ProdByline, StoryPatch
)
from apps.stories.models import StoryType, Section


@pytest.fixture
def celebrity_gossip():
    gossip, _ = Section.objects.get_or_create(title='gossip')
    gossip_story_type, _ = StoryType.objects.get_or_create(
        name='celebrity gossip',
        section=gossip,
    )
    return gossip_story_type


@pytest.fixture
def skandale(celebrity_gossip):
    content = '@tit:Skandale i Uniforum\n@ing:Noen har gjort underslag'
    return ProdStory.objects.create(
        content=content,
        story_type=celebrity_gossip,
    )


@pytest.mark.django_db
def test_create_prodstory(celebrity_gossip):
    story = ProdStory.objects.create(
        story_type=celebrity_gossip,
    )
    assert story.content == ''
    assert story.working_title == 'new story'
    assert story.comments == ''


@pytest.mark.django_db
def test_revisions(skandale):

    content = skandale.content
    assert skandale.patches.count() == 0
    new_content = content + '\n@txt: Oppdatering følger'
    patch = StoryPatch.create_from_story(skandale, new_content)

    assert 'Oppdatering' in patch.patch
    patch.apply()
    skandale.refresh_from_db()
    assert skandale.content == new_content

    old_content = patch.unapply()
    assert old_content == content

    new_content = new_content.replace(
        'gjort', 'begått').replace('Noen', 'Redaktørens mamma')
    patch = StoryPatch.create_from_story(skandale, new_content)
    patch.apply()
    skandale.refresh_from_db()
    assert skandale.content == new_content
    assert skandale.patches.count() == 2
    assert all(p.applied for p in skandale.patches.all())
