"""pytest fixtures"""
import shutil
from pathlib import Path

import pytest
from rest_framework.test import APIClient

from apps.photo.models import ImageFile
from apps.stories.models import Section, Story, StoryType
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission


@pytest.fixture
def staff_client(request, journalist):
    client = APIClient()
    client.login(username='journalist', password='howdypartner')
    yield client
    client.logout()


@pytest.fixture
def journalist(request):
    User = get_user_model()
    try:
        return User.objects.get(username='journalist')
    except User.DoesNotExist:
        pass
    user = User.objects.create_user(
        username='journalist',
        email='journalist@marshall.gov',
        password='howdypartner',
    )
    perms = [
        'add_story',
        'change_story',
        'add_imagefile',
        'change_imagefile',
    ]
    user.user_permissions.add(*Permission.objects.filter(codename__in=perms))
    return user


@pytest.fixture(scope='session')
def editor(request):
    wyatt = get_user_model().objects.create_superuser(
        username='wyatt',
        email='wyatt@marshall.gov',
        password='gunsmoke',
    )
    return wyatt


@pytest.fixture(scope='session')
def news():
    try:
        return StoryType.objects.get(name='News')
    except StoryType.DoesNotExist:
        section = Section.objects.get_or_create(title='Foo')[0]
        return StoryType.objects.create(section=section, name='News')


@pytest.fixture
def scandal(news):
    story = Story.objects.create(
        story_type=news,
        working_title='A shocking scandal!',
    )
    yield story
    story.delete()


@pytest.fixture
def scandal_photo():
    description = 'SCANDAL!!'
    try:
        return ImageFile.objects.get(description=description)
    except ImageFile.DoesNotExist:
        pass
    source = Path(__file__).parent / 'fixtures' / 'dummy.jpg'
    shutil.copy(source, Path('/var/media/scandal.jpg'))
    return ImageFile.objects.create(
        original='scandal.jpg',
        description=description,
    )
