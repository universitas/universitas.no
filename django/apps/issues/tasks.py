"""Tasks for issues and pdfs"""

from datetime import timedelta
import logging
from pathlib import Path
import shutil
import subprocess
import tempfile

from celery import shared_task
from celery.schedules import crontab
from celery.task import periodic_task

from apps.core.staging import new_staging_pdf_files
from apps.issues.models import Issue, PrintIssue, current_issue
from django.conf import settings
from django.core.files.base import ContentFile
from django.utils import timezone

logger = logging.getLogger(__name__)

# Paths and glob pattersn
PAGES_GLOB = 'UNI11VER????????000.pdf'
MAG_PAGES_GLOB = 'UNI12VER????????000.pdf'

OUTPUT_PDF_NAME = 'universitas_{issue.year}-{issue.number}{suffix}.pdf'

# Binaries

GHOSTSCRIPT = '/usr/bin/ghostscript'
CONVERT = '/usr/bin/convert'

# Make bundle Wednesday night
BUNDLE_TIME = crontab(hour=4, minute=0)


@periodic_task(run_every=BUNDLE_TIME)
def weekly_bundle(delete_expired: bool = not settings.DEBUG):
    today = timezone.now().date()
    try:
        issue = Issue.objects.get(publication_date=today)
    except Issue.DoesNotExist:
        return
    logger.info('bundle time!')
    create_print_issue_pdf(
        issue=issue,
        expiration_days=6,
        delete_expired=delete_expired,
    )
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
                    suffix: str = '') -> (Path, bool):
    if not suffix:
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
def convert_pdf_to_web(input_file, quality=90, resolution=150):
    """Compress images and convert to rgb using ghostscript"""
    input_file = Path(input_file)
    input_file.resolve(strict=True)  # Raises FileNotFound
    output_file, no_change = get_output_file(input_file, 'WEB')
    if no_change:
        return output_file

    rgb_profile = Path(__file__).parent / 'sRGB.icc'
    if not rgb_profile.exists():
        msg = f'Color profile "{rgb_profile.name}" is missing'
        raise RuntimeError(msg)
    args = [
        GHOSTSCRIPT,
        '-q',
        '-dColorConversionStrategy=/DeviceRGB',
        '-dColorConversionStrategyForImages=/DeviceRGB',
        '-dBATCH',
        '-dNOPAUSE',
        '-sDEVICE=pdfwrite',
        '-dConvertCMYKImagesToRGB=true',
        '-dDownsampleColorImages=true',
        '-dDownsampleGrayImages=true',
        '-dDownsampleMonoImages=true',
        f'-sDefaultRGBProfile={rgb_profile}',
        f'-dJPEGQ={quality}',
        f'-dColorImageResolution={resolution}',
        f'-dGrayImageResolution={resolution}',
        f'-dMonoImageResolution={resolution}',
        '-o',
        output_file,
        input_file,
    ]
    subprocess.run(map(str, args))
    logger.debug(
        f'{input_file} ({input_file.stat().st_size}) -> '
        f'{output_file} ({output_file.stat().st_size})'
    )
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


def create_web_bundle(filename, issue, **kwargs):
    """Creates a web bundle file"""
    pages = get_staging_pdf_files(**kwargs)
    if not pages:
        raise RuntimeWarning('No pages found')
    if len(pages) % 4 != 0:
        raise RuntimeError(f'Wrong number of pages {len(pages)}')

    optimized_pages = [convert_pdf_to_web(pdf) for pdf in pages]
    PS_DATEFORMAT = 'D: %Y%m%d%H%M%S'  # used in pdf metadata
    output_file = Path(filename)
    pdfmark = output_file.parent / 'pdfmark'  # pdf meta data
    pdfmark.write_text((
        f'[/Title (Universitas {issue.issue_name})'
        f'/CreationDate ({issue.publication_date:{PS_DATEFORMAT}})'
        f'/ModDate ({timezone.now():{PS_DATEFORMAT}})'
        '/Creator (Universitas)'
        '/Subject (Nyheter)'
        '/DOCINFO pdfmark'
        '['
        '/PageMode'
        '/UseThumbs'  # do not show thumbs
        '/Page 1'
        '/View [/Fit]'  # fit full page
        '/PageLayout'
        '/TwoColumnRight'  # two column layout
        '/PageLabels'
        '<< /Nums [0 << /S /D /St 1 >>] >>'  # fix page numbers
        '/DOCVIEW pdfmark'
    ))
    output_file.touch()
    args = [
        GHOSTSCRIPT,
        '-q',
        '-o',
        output_file,
        '-dBATCH',
        '-dNOPAUSE',
        '-dAutoRotatePages=/None',
        '-sDEVICE=pdfwrite',
        '-dCompressFonts=true',
        '-dSubsetFonts=true',
        '-dCompatibilityLevel=1.6',
        '-dDetectDuplicateImages=true',
        '-sDEVICE=pdfwrite',
        *optimized_pages,
        pdfmark,
    ]
    subprocess.run(map(str, args))
    pdfmark.unlink()
    return output_file


@shared_task
def create_print_issue_pdf(issue, **kwargs):
    """Create or update pdf for the current issue"""

    editions = [('', PAGES_GLOB), ('_mag', MAG_PAGES_GLOB)]
    results = []
    for suffix, fileglob in editions:

        pdf_name = OUTPUT_PDF_NAME.format(issue=issue, suffix=suffix)
        logger.info('Creating pdf: {}'.format(pdf_name))
        tmp_bundle_file = tempfile.NamedTemporaryFile(suffix='.pdf')
        try:
            create_web_bundle(
                issue=issue,
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
