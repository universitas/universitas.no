"""Tests for models in the Issues app"""

import pytest
import tempfile
import os
from django.utils.timezone import datetime
from django.core.files.base import ContentFile
from apps.issues.models import (PrintIssue, Issue)


def get_contentfile(filepath):
    """Get a django contentfile from file path"""
    with open(filepath, 'rb') as src:
        content = ContentFile(src.read())
    return content


@pytest.fixture
def tempdir():
    _dir = tempfile.TemporaryDirectory(prefix='django_test_')
    return _dir


@pytest.fixture
def fixture_pdf():
    dir_path = os.path.dirname(
        os.path.realpath(__file__))
    return os.path.join(dir_path, 'blank_page.pdf')


@pytest.mark.django_db
def test_create_issue():
    new_issue = Issue.objects.create(
        publication_date=datetime(2020, 1, 1),
    )
    assert str(new_issue) == '1/2020 01. Jan'


@pytest.mark.django_db
def test_create_printissue(fixture_pdf, settings, tempdir):
    settings.MEDIA_ROOT = tempdir.name

    new_printissue = PrintIssue()
    content = get_contentfile(fixture_pdf)
    filename = os.path.basename(fixture_pdf)
    new_printissue.pdf.save(filename, content, save=False)
    # new_printissue.full_clean()
    new_printissue.save()
    assert filename in str(new_printissue)
    assert new_printissue.pages == 1

    new_printissue.get_thumbnail()
    assert new_printissue.cover_page.path.endswith(
        '/covers/blank_page.jpg')
    year_zero = datetime.min.date()
    assert new_printissue.issue.publication_date > year_zero
