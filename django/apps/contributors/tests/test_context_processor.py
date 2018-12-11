"""Tests for creating stories and parsing stuff"""

import pytest

from apps.contributors import context_processors, models


@pytest.fixture
def editors():
    models.Stint.objects.create(
        contributor=models.Contributor.objects.create(
            display_name='J Jonah Jameson',
            email='editor@dailybugle.com',
            phone='555-55555',
        ),
        position=models.Position.objects.create(title='redaktør'),
    )


@pytest.mark.django_db
def test_staff_context_processor(editors):
    staff = context_processors.get_staff()
    assert len(staff) == 6
    editor = staff[0]
    assert editor == {
        'name': 'J Jonah Jameson',
        'position': 'redaktør',
        'phone': '555-55555',
        'email': 'editor@dailybugle.com',
    }
