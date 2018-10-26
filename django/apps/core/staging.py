"""
Utilities for synchronising staging files between home server, S3 and database
"""
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import List

from django.conf import settings

IMAGES_DIR = 'IMAGES'
PDF_DIR = 'PDF'
IMAGE_GLOB = '*.*'


def get_staging_dir(name: str) -> Path:
    """Lazy lookup to support test monkeypatching"""
    return Path(settings.STAGING_ROOT) / name


def timestamp(delta: timedelta, fallback: datetime) -> int:
    """Calculates seconds since epoch of current time minus delta.
    If delta is out of range, calculates timestamp of fallback datetime
    instead.
    """
    try:
        dt = datetime.now() - delta
    except (OverflowError):
        # date out of bounds
        dt = fallback
    return int(time.mktime(dt.timetuple()))


def new_staging_files(
    directory: Path,
    fileglob='*.*',
    min_age: timedelta = None,
    max_age: timedelta = None,
) -> List[Path]:
    """Check for new or updated files in staging area."""

    min_mtime = timestamp(min_age or timedelta.max, fallback=datetime.max)
    max_mtime = timestamp(max_age or timedelta.min, fallback=datetime.min)

    directory.mkdir(parents=True, exist_ok=True)
    all_files = directory.glob(fileglob)

    return sorted(
        file for file in all_files
        if min_mtime > file.stat().st_mtime > max_mtime
    )


def new_staging_images(**kwargs) -> List[Path]:
    """Check for new or updated images in staging area"""
    kwargs = {
        'directory': get_staging_dir(IMAGES_DIR),
        'fileglob': IMAGE_GLOB,
        **kwargs,
    }
    return new_staging_files(**kwargs)


def new_staging_pdf_files(**kwargs) -> List[Path]:
    """Check for new or updated pdf files in staging area"""
    kwargs = {
        'directory': get_staging_dir(PDF_DIR),
        'fileglob': 'UNI1*VER*000.pdf',
        **kwargs,
    }
    return new_staging_files(**kwargs)
