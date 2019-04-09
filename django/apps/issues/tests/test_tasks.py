"""Tests for issue and pdf tasks"""

import datetime
from datetime import date
from pathlib import PosixPath as Path
import shutil
import tempfile

from PIL import Image
from django.utils import timezone
import pytest

from apps.issues.models import Issue, PrintIssue
from apps.issues.tasks import (
    MissingBinary,
    convert_pdf_to_web,
    create_print_issue_pdf,
    create_web_bundle,
    generate_pdf_preview,
    get_staging_pdf_files,
    require_binary,
    weekly_bundle,
)

PAGE_ONE = 'UNI11VER16010101000.pdf'


@pytest.fixture
def first_issue(db):
    return Issue.objects.get_or_create(publication_date=date(1946, 1, 1),)[0]


@pytest.fixture
def tmp_fixture_dir(settings):
    """A temporary directory that will be deleted from the file system
    when the object is garbage collected."""
    tmpdir = tempfile.TemporaryDirectory()

    src = Path(__file__).parent / 'STAGING'
    dst = Path(tmpdir.name) / 'STAGING'
    shutil.copytree(str(src), str(dst), copy_function=shutil.copy)

    # Yield will keep the TemporaryDirectory from being garbage collected.
    settings.STAGING_ROOT = str(dst)
    yield dst


def test_get_staging_pdf_files(tmp_fixture_dir):
    # get both magazine and regular pages
    pages = get_staging_pdf_files()
    assert len(pages) == 8

    # Only regular issue files
    assert len(get_staging_pdf_files(fileglob='UNI11*.pdf')) == 4

    # Exclude pages that are older than tomorrow
    future_pages = get_staging_pdf_files(expiration_days=-1)
    assert len(future_pages) == 0
    # Files should exist
    assert all(pdf.exists() for pdf in pages)

    future_pages = get_staging_pdf_files(
        expiration_days=-1, delete_expired=True
    )
    assert len(future_pages) == 0
    # Files should be deleted
    assert not any(pdf.exists() for pdf in pages)


def test_convert_pdf_page_to_web(tmp_fixture_dir):
    """Convert single page pdf to web version"""

    pdf = Path(tmp_fixture_dir) / 'PDF' / PAGE_ONE

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


def test_create_bundle(tmp_fixture_dir):
    bundle_file = tmp_fixture_dir / 'bundle.pdf'
    assert not bundle_file.exists()

    bundle = create_web_bundle(bundle_file, issue=Issue())
    assert bundle.exists()
    assert bundle.stat().st_size > 1000


def test_convert_pdf_page_to_image(tmp_fixture_dir):
    """Convert single page pdf to image"""

    pdf = tmp_fixture_dir / 'PDF' / PAGE_ONE

    # Make new file
    png_file = generate_pdf_preview(pdf)

    # Default file location
    assert png_file == (pdf.parent / 'PNG' / PAGE_ONE).with_suffix('.png')
    assert png_file.exists()
    img = Image.open(str(png_file))

    # Verifies that output is a valid image file
    assert img.verify() is None


def test_require_binary_decorator():
    def fn():
        return 'spam'

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
def test_create_current_issue_web_bundle(
        first_issue, tmp_fixture_dir, monkeypatch
):
    assert PrintIssue.objects.count() == 0

    def mock_now():
        dt = first_issue.publication_date
        now = datetime.datetime(
            year=dt.year,
            month=dt.month,
            day=dt.day,
            hour=3,
            minute=0,
            tzinfo=datetime.timezone.utc,
        )
        return now

    with monkeypatch.context() as m:
        weekly_bundle(False)
        assert PrintIssue.objects.count() == 0
        m.setattr(timezone, 'now', mock_now)
        weekly_bundle(False)
        assert PrintIssue.objects.count() == 2
    count = Issue.objects.count()
    # create_print_issue_pdf(first_issue)
    # create_print_issue_pdf(first_issue)
    # assert PrintIssue.objects.count() == 2
    assert Issue.objects.count() == count
    staging_dir = tmp_fixture_dir / 'PDF'
    mag_pages = list(staging_dir.glob('UNI12*.pdf'))
    assert len(mag_pages) == 4
    mag_pages[0].unlink()

    # Wrong number of pages
    with pytest.raises(RuntimeError):
        create_print_issue_pdf(first_issue)

    assert PrintIssue.objects.count() == 2
    assert Issue.objects.count() == count
