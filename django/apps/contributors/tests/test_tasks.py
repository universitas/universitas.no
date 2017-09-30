"""Tests for contributor tasks"""

import pytest
from apps.contributors.models import Contributor, Position, Stint
from apps.contributors.tasks import (
    connect_contributor_to_user, update_contributor_status, update_status
)
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

SIX_MONTHS_AGO = timezone.now() - timezone.timedelta(days=6 * 30)
LAST_WEEK = timezone.now() - timezone.timedelta(days=7)


@pytest.fixture
def alice_bob_cherry():
    return [
        Contributor.objects.create(
            display_name=name,
            email=f'{name.lower().replace(" ", ".")}@example.com',
        ) for name in ['Alice Arntzen', 'Bob Bobsen', 'Cherry Carlsson']
    ]


@pytest.fixture
def journalist():
    return Position.objects.create(title='journalist')


@pytest.mark.django_db
def test_connect_to_user(alice_bob_cherry):
    alice, bob, cherry = alice_bob_cherry
    bob_user = User.objects.create_user(
        username='buser',
        first_name=bob.first_name,
        last_name=bob.last_name,
    )
    cherry_user = User.objects.create_user(
        username='cuser',
        email=cherry.email,
    )
    assert User.objects.filter(first_name=bob.first_name).first() == bob_user

    # No matching user for Alice
    assert connect_contributor_to_user(alice) is None
    # Bob user with same first and last name
    assert connect_contributor_to_user(bob) == bob_user
    # Cherry user with same email
    assert connect_contributor_to_user(cherry) == cherry_user

    # Force create user for Alice
    alice_user = connect_contributor_to_user(alice, create=True)
    assert alice_user.get_full_name() == alice.display_name
    assert alice_user.email == alice.email


@pytest.mark.django_db
def test_connect_to_user_duplicates(alice_bob_cherry):
    alice, bob, cherry = alice_bob_cherry
    # Create new user for Alice
    alice_user = connect_contributor_to_user(alice, create=True)

    # They are the same person!
    bob.email = alice.email
    bob_user = connect_contributor_to_user(bob)
    assert bob_user == alice_user

    # Bob has been merged into Alice
    assert bob.refresh_from_db() == None


@pytest.mark.django_db
def test_update_status_basic(alice_bob_cherry, journalist):
    alice, bob, cherry = alice_bob_cherry

    # Active becomes inactive
    alice.set_active()
    assert alice.status == Contributor.ACTIVE
    update_contributor_status(alice)
    assert alice.status == Contributor.RETIRED

    # Unknown becomes retired
    assert bob.status == Contributor.UNKNOWN
    update_contributor_status(bob)
    assert bob.status == Contributor.RETIRED

    # External is still external
    cherry.status = Contributor.EXTERNAL
    assert cherry.status == Contributor.EXTERNAL
    update_contributor_status(cherry)
    assert cherry.status == Contributor.EXTERNAL


@pytest.mark.django_db
def test_update_status_from_stints(alice_bob_cherry, journalist):
    alice, bob, cherry = alice_bob_cherry
    # Alice just started
    Stint.objects.create(
        contributor=alice,
        position=journalist,
        start_date=LAST_WEEK,
        end_date=None,
    )
    # Bob had a very short stint
    Stint.objects.create(
        contributor=bob,
        position=journalist,
        start_date=SIX_MONTHS_AGO,
        end_date=SIX_MONTHS_AGO,
    )
    # Cherry just quit
    Stint.objects.create(
        contributor=cherry,
        position=journalist,
        start_date=SIX_MONTHS_AGO,
        end_date=LAST_WEEK,
    )
    # update everyone's status
    update_status()

    # Alice is now "Active"
    alice.refresh_from_db()
    assert alice.status == Contributor.ACTIVE

    # Bob is now "Retired"
    bob.refresh_from_db()
    assert bob.status == Contributor.RETIRED

    # Cherry's status is unchanges, since she's within the cutoff
    cherry.refresh_from_db()
    assert cherry.status == Contributor.UNKNOWN
