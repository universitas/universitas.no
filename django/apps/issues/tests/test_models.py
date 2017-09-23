"""Tests for models in the Issues app"""

import os
import tempfile
from datetime import date

import pytest
from apps.issues.models import (
    Issue, PrintIssue, error_image, pdf_to_image, pdf_to_text
)
from django.core.files.base import ContentFile
from django.utils.timezone import datetime


def get_contentfile(filepath):
    """Get a django contentfile from file path"""
    with open(filepath, 'rb') as src:
        content = ContentFile(src.read())
    return content


@pytest.fixture(scope='module')
def tempdir():
    """A temporary directory that will be deleted from the file system
    when the object is garbage collected."""
    return tempfile.TemporaryDirectory()


@pytest.fixture(scope='module')
def fixture_pdf():
    this_dir = os.path.dirname(os.path.realpath(__file__))
    return os.path.join(this_dir, 'fixture_universitas.pdf')


@pytest.mark.django_db
def test_create_issue():
    new_issue = Issue.objects.create(publication_date=datetime(2020, 1, 1), )
    new_issue.full_clean()
    assert str(new_issue) == '1/2020 01. Jan'


def test_extract_page_text(fixture_pdf):
    pdf = get_contentfile(fixture_pdf)
    page_one_text = pdf_to_text(pdf, 1)
    assert page_one_text == 'Page 1'
    all_text = pdf_to_text(pdf, 1, 4)
    assert 'Page 1' in all_text
    assert 'Page 4' in all_text


def test_create_cover(fixture_pdf):
    # valid pdf
    pdf = get_contentfile(fixture_pdf)
    cover = pdf_to_image(pdf)
    assert cover.size[1] == 800

    # invalid pdf
    cover = error_image('foo', 200, 400)
    assert cover.size == (200, 400)


@pytest.mark.django_db
def test_create_printissue(fixture_pdf, settings, tempdir):

    # use temporary directory for pdf and frontpage file
    settings.MEDIA_ROOT = tempdir.name
    settings.DEFAULT_FILE_STORAGE = \
        'django.core.files.storage.FileSystemStorage'

    print_issue = PrintIssue()
    content = get_contentfile(fixture_pdf)
    filename = os.path.basename(fixture_pdf)

    # Save content of fixture pdf as well as model
    print_issue.pdf.save(filename, content)

    # Check that publication date works
    publication_date = print_issue.get_publication_date()
    assert publication_date > date(1900, 1, 1)

    assert 'fixture_universitas' in str(print_issue)
    assert print_issue.pages == 4

    # Assert that an Issue has been created and a publication
    # date has been inferred from the pdf file content or file timestamp
    issue = print_issue.issue
    assert isinstance(issue, Issue)
    assert issue.publication_date > date(2000, 9, 9)

    # Assert that all fields are populated
    print_issue.full_clean()

    # Create thumbnail of cover page
    print_issue.get_cover_page()
    assert print_issue.cover_page.path.endswith(
        '/covers/fixture_universitas.jpg'
    )
