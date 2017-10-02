"""Tasks for issues and pdfs"""

import logging
import shutil
import subprocess
import tempfile
from datetime import timedelta
from pathlib import Path

from apps.core.staging import new_staging_pdf_files
from apps.issues.models import PrintIssue, current_issue
from celery import shared_task
from celery.schedules import crontab
from celery.task import periodic_task
from django.conf import settings
from django.core.files.base import ContentFile

logger = logging.getLogger(__name__)

# Paths and glob pattersn
PAGES_GLOB = 'UNI11VER*.pdf'
MAG_PAGES_GLOB = 'UNI12VER*.pdf'

OUTPUT_PDF_NAME = 'universitas_{issue.year}-{issue.number}{suffix}.pdf'

# Binaries

GHOSTSCRIPT = '/usr/bin/ghostscript'
CONVERT = '/usr/bin/convert'

# Make bundle Wednesday night
BUNDLE_TIME = crontab(hour=4, minute=0, day_of_week=3)


@periodic_task(run_every=BUNDLE_TIME)
def weekly_bundle(delete_expired: bool = not settings.DEBUG):
    logger.info('bundle time!')
    create_print_issue_pdf(expiration_days=6, delete_expired=delete_expired)
    # remove old web pages
    get_staging_pdf_files(
        fileglob='WEB/*.pdf',
        expiration_days=1,
        delete_expired=delete_expired,
    )


class MissingBinary(RuntimeError):
    """A required non-Python executable was not found"""


def require_binary(binary: str):
    """Raise error if required binary is not installed"""

    def binary_decorator(fn):
        def fn_wrapper(*args, **kwargs):
            if shutil.which(binary):
                return fn(*args, **kwargs)
            msg = 'Required binary "{}" is not installed'.format(binary)
            raise MissingBinary(msg)

        return fn_wrapper

    return binary_decorator


def get_staging_pdf_files(delete_expired=False, expiration_days=0, **kwargs):
    """Find pages for latest issue in pdf staging directory."""

    if expiration_days:
        expired = timedelta(days=expiration_days)
    else:
        expired = None

    if delete_expired:
        for expired_file in new_staging_pdf_files(min_age=expired, **kwargs):
            expired_file.unlink()

    return new_staging_pdf_files(max_age=expired, **kwargs)


def get_output_file(input_file: Path, subfolder: str,
                    suffix: str = None) -> (Path, bool):
    if suffix is None:
        suffix = input_file.suffix
    if suffix and not suffix.startswith('.'):
        suffix = '.' + suffix
    output_dir = input_file.parent / subfolder
    output_dir.mkdir(exist_ok=True)
    output_file = output_dir / input_file.name
    output_file = output_file.with_suffix(suffix)

    no_change = (
        output_file.exists()
        and output_file.stat().st_mtime > input_file.stat().st_mtime
    )
    return output_file, no_change


@require_binary(GHOSTSCRIPT)
def convert_pdf_to_web(input_file):
    """Compress images and convert to rgb using ghostscript"""
    input_file = Path(input_file)
    input_file.resolve(strict=True)  # Raises FileNotFound
    output_file, no_change = get_output_file(input_file, 'WEB')
    if no_change:
        return output_file

    rgb_profile = Path(__file__).parent / 'sRGB.icc'
    if not rgb_profile.exists():
        msg = 'Color profile "{}" is missing'.format(rgb_profile.name)
        raise RuntimeError(msg)
    args = [
        GHOSTSCRIPT,
        '-q',
        '-sDefaultRGBProfile={}'.format(rgb_profile),
        '-dColorConversionStrategy=/DeviceRGB'
        '-dColorConversionStrategyForImages=/DeviceRGB'
        '-dBATCH',
        '-dNOPAUSE',
        '-sDEVICE=pdfwrite',
        '-dConvertCMYKImagesToRGB=true',
        '-dDownsampleColorImages=true',
        '-dDownsampleGrayImages=true',
        '-dDownsampleMonoImages=true',
        '-dColorImageResolution=120',
        '-dGrayImageResolution=120',
        '-dMonoImageResolution=120',
        '-o',
        output_file,
        input_file,
    ]
    subprocess.run(map(str, args))
    return output_file


@require_binary(CONVERT)
def generate_pdf_preview(input_file, img_format='png', size=300):
    input_file = Path(input_file)
    input_file.resolve()  # Raises FileNotFound
    output_file, no_change = get_output_file(
        input_file, img_format.upper(), img_format
    )
    if no_change:
        return output_file

    args = [
        CONVERT,
        '-density',
        160,
        '-colorspace',
        'CMYK',
        input_file,
        '-background',
        'white',
        '-flatten',
        '-resize',
        '{}x'.format(size),
        '-format',
        img_format.strip('.'),
        '-colorspace',
        'sRGB',
        output_file,
    ]
    subprocess.run(map(str, args))

    return output_file


def create_web_bundle(filename, **kwargs):
    """Creates a web bundle file"""
    output_file = Path(filename)
    output_file.touch()

    pages = get_staging_pdf_files(**kwargs)

    number_of_pages = len(pages)
    if number_of_pages == 0:
        raise RuntimeWarning('No pages found')

    if number_of_pages % 4 != 0:
        raise RuntimeError('Wrong number of pages %d' % number_of_pages)

    logger.info('{} pages found'.format(number_of_pages))

    optimized_pages = [convert_pdf_to_web(pdf) for pdf in pages]

    args = [
        GHOSTSCRIPT,
        '-q',
        '-o',
        output_file,
        '-dFirstPage=1',
        '-dBATCH',
        '-dNOPAUSE',
        '-dAutoRotatePages=/None',
        '-sDEVICE=pdfwrite',
        '-dCompressFonts=true',
        '-dSubsetFonts=true',
        '-dCompatibilityLevel=1.6',
        '-dDetectDuplicateImages=true',
        '-sDEVICE=pdfwrite',
    ] + optimized_pages

    subprocess.run(map(str, args))
    return output_file


@shared_task
def create_print_issue_pdf(**kwargs):
    """Create or update pdf for the current issue"""

    issue = current_issue()
    editions = [('', PAGES_GLOB), ('_mag', MAG_PAGES_GLOB)]
    results = []
    for suffix, fileglob in editions:

        pdf_name = OUTPUT_PDF_NAME.format(issue=issue, suffix=suffix)
        logger.info('Creating pdf: {}'.format(pdf_name))
        tmp_bundle_file = tempfile.NamedTemporaryFile(suffix='.pdf')
        try:
            create_web_bundle(
                filename=tmp_bundle_file.name,
                fileglob=fileglob,
                **kwargs,
            )
        except RuntimeWarning as warning:
            logger.info(str(warning))
            continue
        try:
            print_issue = PrintIssue.objects.get(pdf__contains=pdf_name)
        except PrintIssue.DoesNotExist:
            print_issue = PrintIssue()
        with open(tmp_bundle_file.name, 'rb') as src:
            pdf_content = ContentFile(src.read())
        print_issue.pdf.save(pdf_name, pdf_content, save=False)
        print_issue.issue = issue
        print_issue.save()
        logger.info('New bundle file: {}'.format(pdf_name))
        results.append(pdf_name)
    return results
