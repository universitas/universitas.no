"""Tests for issue and pdf tasks"""

from PIL import Image
import pytest
import tempfile
import os
import shutil
import pathlib
from datetime import date
# from django.utils.timezone import datetime
from django.core.files.base import ContentFile
from apps.issues.models import Issue, PrintIssue
# from apps.issues.models import extract_pdf_text
from apps.issues.tasks import (
    MissingBinary,
    require_binary,
    convert_pdf_to_web,
    get_staging_pdf_files,
    optimize_staging_pages,
    generate_pdf_preview,
    create_web_bundle,
    create_print_issue_pdf,
)

PAGE_ONE = 'UNI11VER16010101000.pdf'


def get_contentfile(filepath):
    """Get a django contentfile from file path"""
    with open(filepath, 'rb') as src:
        content = ContentFile(src.read())
    return content


@pytest.fixture
def tmp_fixture_dir(settings):
    """A temporary directory that will be deleted from the file system
    when the object is garbage collected."""
    tmpdir = tempfile.TemporaryDirectory()
    settings.STAGING_ROOT = tmpdir.name

    src = pathlib.Path(__file__).parent / 'STAGING'
    dst = pathlib.Path(tmpdir.name) / 'STAGING'
    shutil.copytree(str(src), str(dst))
    # Yield will keep the TemporaryDirectory from being garbage collected.
    yield pathlib.Path(tmpdir.name)


def test_get_staging_pdf_files(tmp_fixture_dir):
    globpattern = 'UNI11VER*.pdf'
    pages = get_staging_pdf_files(globpattern)
    assert len(pages) == 4

    # Exclude pages that are older than tomorrow
    future_pages = get_staging_pdf_files(globpattern, expiration_days=-1)
    assert len(future_pages) == 0
    # Files should exist
    assert all(os.path.exists(pdf) for pdf in pages)
    future_pages = get_staging_pdf_files(
        globpattern, expiration_days=-1, delete_expired=True)
    assert len(future_pages) == 0
    # Files should be deleted
    assert all(not os.path.exists(pdf) for pdf in pages)


def test_convert_pdf_page_to_web(tmp_fixture_dir):
    """Convert single page pdf to web version"""

    pdf = pathlib.Path(tmp_fixture_dir) / 'STAGING' / 'PDF' / PAGE_ONE

    # Make new file
    opt = convert_pdf_to_web(pdf)

    # Default file location
    assert opt == pdf.parent / 'WEB' / PAGE_ONE
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
    pages = optimize_staging_pages()
    assert len(pages) == 8


def test_create_bundle(tmp_fixture_dir):
    bundle_file = tmp_fixture_dir / 'bundle.pdf'
    assert not bundle_file.exists()

    bundle = create_web_bundle(bundle_file)
    assert bundle.exists()
    assert bundle.stat().st_size > 1000


def test_convert_pdf_page_to_image(tmp_fixture_dir):
    """Convert single page pdf to image"""

    pdf = tmp_fixture_dir / 'STAGING' / 'PDF' / PAGE_ONE

    # Make new file
    png_file = generate_pdf_preview(pdf)

    # Default file location
    assert png_file == (pdf.parent / 'PNG' / PAGE_ONE).with_suffix('.png')
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
    with pytest.raises(MissingBinary) as excinfo:
        impossible_fn()
    assert 'Required binary ' in str(excinfo.value)


@pytest.mark.django_db
def test_create_current_issue_web_bundle(tmp_fixture_dir):
    assert PrintIssue.objects.count() == 0
    assert Issue.objects.count() == 0
    create_print_issue_pdf()
    assert PrintIssue.objects.count() == 2
    assert Issue.objects.count() == 1
    staging_dir = tmp_fixture_dir / 'STAGING' / 'PDF'
    mag_pages = list(staging_dir.glob('UNI12*.pdf'))
    assert len(mag_pages) == 4
    mag_pages[0].unlink()

    # Wrong number of pages
    with pytest.raises(RuntimeError):
        create_print_issue_pdf()

    assert PrintIssue.objects.count() == 2
    assert Issue.objects.count() == 1
