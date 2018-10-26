"""pytest fixtures"""
import shutil
from pathlib import Path

import pytest
from rest_framework.test import APIClient

from apps.contributors.models import Contributor
from apps.photo.models import ImageFile
from apps.stories.models import Section, Story, StoryType
from django.contrib.auth.models import Permission


@pytest.fixture()
def journalist(db, django_user_model, django_username_field):
    """A staff user with typical staff permissions."""
    UserModel = django_user_model
    username_field = django_username_field
    perms = [
        'add_story',
        'change_story',
        'add_imagefile',
        'change_imagefile',
        'add_storyimage',
        'change_storyimage',
    ]
    try:
        user = UserModel._default_manager.get(**{username_field: 'journalist'})
    except UserModel.DoesNotExist:
        user = UserModel._default_manager.create_user(
            **{
                username_field: 'journalist',
                'email': 'journalist@marshall.gov',
                'password': 'password',
            }
        )
    user.user_permissions.add(*Permission.objects.filter(codename__in=perms))
    return user


@pytest.fixture
def staff_client(db, journalist):
    client = APIClient()
    client.login(username=journalist.username, password='password')
    yield client
    # client.logout()  # maybe not needed?


@pytest.fixture
def news(db):
    """News StoryType"""
    try:
        return StoryType.objects.get(name='News')
    except StoryType.DoesNotExist:
        section = Section.objects.get_or_create(title='Foo')[0]
        return StoryType.objects.create(section=section, name='News')


@pytest.fixture
def writer(db):
    writer = Contributor.objects.create(display_name='Ernest Hemingway', )
    yield writer
    writer.delete()


@pytest.fixture
def scandal(db, news):
    """A typical news story"""
    story = Story.objects.create(
        story_type=news,
        working_title='A shocking scandal!',
        title='A shocking scandal!',
        theme_word='scandal',
    )
    yield story
    story.delete()


@pytest.fixture
def scandal_photo(db):
    """A typical news photo"""
    description = 'SCANDAL!!'
    pk = 22
    filename = f'scandal.{pk}.jpg'
    try:
        return ImageFile.objects.get(description=description)
    except ImageFile.DoesNotExist:
        pass
    source = Path(__file__).parent / 'fixtures' / 'dummy.jpg'
    shutil.copy(source, Path('/var/media/') / filename)
    yield ImageFile.objects.create(
        id=pk,
        original=filename,
        stem='scandal',
        description=description,
    )
