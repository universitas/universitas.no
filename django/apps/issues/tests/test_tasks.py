"""Tests for issue and pdf tasks"""

from PIL import Image
import pytest
import tempfile
import os
import glob
import shutil
import pathlib
from datetime import date
# from django.utils.timezone import datetime
from django.core.files.base import ContentFile
from apps.issues.models import (PrintIssue, Issue)
# from apps.issues.models import extract_pdf_text
from apps.issues.tasks import (
    require_binary,
    convert_pdf_to_web,
    get_staging_pdf_files,
    optimize_staging_pages,
    generate_pdf_preview,
    create_web_bundle,
    create_print_issue_pdf,
)


def get_contentfile(filepath):
    """Get a django contentfile from file path"""
    with open(filepath, 'rb') as src:
        content = ContentFile(src.read())
    return content


@pytest.fixture
def tmp_fixture_dir():
    """A temporary directory that will be deleted from the file system
    when the object is garbage collected."""
    thisdir = os.path.dirname(__file__)
    fixture_files = glob.glob(os.path.join(thisdir, '*.pdf'))
    tmpdir = tempfile.TemporaryDirectory()
    for pdf in fixture_files:
        shutil.copy(pdf, tmpdir.name)
    return tmpdir


def test_get_staging_pdf_files(tmp_fixture_dir):
    fixture_dir = tmp_fixture_dir.name
    pages = get_staging_pdf_files('pg*.pdf', fixture_dir)
    assert len(pages) == 4

    # Exclude pages that are older than tomorrow
    future_pages = get_staging_pdf_files(
        'pg*.pdf', fixture_dir, expiration_days=-1)
    assert len(future_pages) == 0
    # Files should exist
    assert all(os.path.exists(pdf) for pdf in pages)
    future_pages = get_staging_pdf_files(
        'pg*.pdf', fixture_dir, expiration_days=-1,
        delete_expired=True)
    assert len(future_pages) == 0
    # Files should be deleted
    assert all(not os.path.exists(pdf) for pdf in pages)


def test_convert_pdf_page_to_web(tmp_fixture_dir):
    """Convert single page pdf to web version"""

    pdf = pathlib.Path(tmp_fixture_dir.name) / 'pg1.pdf'

    # Make new file
    opt = convert_pdf_to_web(pdf)

    # Default file location
    assert opt == pdf.parent / 'WEB' / 'pg1.pdf'
    assert opt.exists()

    # Conversion changes file content
    assert opt.stat().st_size != pdf.stat().st_size

    # Calling again should not create new file
    mtime = opt.stat().st_mtime
    opt2 = convert_pdf_to_web(pdf)
    assert opt2.stat().st_mtime == mtime

    # If pdf if changed, convert should rerun
    pdf.touch()
    opt3 = convert_pdf_to_web(pdf)
    assert opt3.stat().st_mtime > mtime

    # Nonexisting file should raise error
    false_pdf = pdf.with_name('nonexisting')
    assert not false_pdf.is_file()
    with pytest.raises(FileNotFoundError):
        convert_pdf_to_web(false_pdf)


def test_optimize_all_pages(tmp_fixture_dir):
    fixture_dir = tmp_fixture_dir.name
    pages = optimize_staging_pages('pg*.pdf', fixture_dir)
    assert len(pages) == 4


def test_create_bundle(tmp_fixture_dir):
    fixture_dir = tmp_fixture_dir.name
    bundle_file = pathlib.Path(fixture_dir) / 'bundle.pdf'
    assert not bundle_file.exists()

    bundle = create_web_bundle(bundle_file, 'pg*.pdf', fixture_dir)
    assert bundle.exists()
    assert bundle.stat().st_size > 1000


def test_convert_pdf_page_to_image(tmp_fixture_dir):
    """Convert single page pdf to image"""

    pdf = pathlib.Path(tmp_fixture_dir.name) / 'pg1.pdf'

    # Make new file
    png_file = generate_pdf_preview(pdf)

    # Default file location
    assert str(png_file) == str(pdf.parent / 'PNG' / 'pg1.png')
    assert png_file.exists()
    img = Image.open(str(png_file))

    # Verifies that output is a valid image file
    assert img.verify() is None


def test_require_binary_decorator():

    def fn(): return 'spam'
    assert fn() == 'spam'

    # Try to decorate fn() with a valid binary
    does_exist = 'ls'
    assert shutil.which(does_exist)

    possible_fn = require_binary(does_exist)(fn)
    assert possible_fn() == 'spam'

    # Try to decorate fn() with a nonexisting binaryj
    doesnt_exist = 'lolFOObarSNAFU'
    assert not shutil.which(doesnt_exist)

    impossible_fn = require_binary(doesnt_exist)(fn)
    with pytest.raises(RuntimeError) as excinfo:
        impossible_fn()
    assert 'Required binary ' in str(excinfo.value)


@pytest.mark.django_db
def test_create_current_issue_web_bundle():
    Issue.objects.create(
        publication_date=date(2016, 1, 1))
    result = create_print_issue_pdf()
    assert result == ['universitas_2016-1.pdf', 'universitas_2016-1_mag.pdf']




