"""Tasks for issues and pdfs"""

import shutil
import subprocess
import pathlib
from datetime import datetime
import tempfile
# import re

from django.conf import settings
from django.core.files.base import ContentFile
from apps.issues.models import current_issue, PrintIssue
from celery import shared_task

import logging
logger = logging.getLogger(__name__)

# Paths and glob pattersn
PAGES_GLOB = 'UNI11VER*.pdf'
MAG_PAGES_GLOB = 'UNI12VER*.pdf'
# OUTPUT_PDF_DIRECTORY = STAGING_ROOT / 'pdf'
OUTPUT_PDF_NAME = 'universitas_{issue.date.year}-{issue.number}{suffix}.pdf'

# Binaries
GHOSTSCRIPT = '/usr/bin/ghostscript'
CONVERT = '/usr/bin/convert'


class MissingBinary(RuntimeError):
    pass


def require_binary(binary):
    """Raise error if required binary is not installed"""

    def binary_decorator(fn):
        def fn_wrapper(*args, **kwargs):
            if shutil.which(binary):
                return fn(*args, **kwargs)
            msg = 'Required binary "{}" is not installed'.format(binary)
            raise MissingBinary(msg)
        return fn_wrapper
    return binary_decorator


def get_staging_pdf_files(
        globpattern='*.pdf',
        directory=None,
        expiration_days=0,
        delete_expired=False):
    """Find pages for latest issue in pdf staging directory."""

    if directory is None:
        staging_dir = pathlib.Path(settings.STAGING_ROOT) / 'STAGING' / 'PDF'
    else:
        staging_dir = pathlib.Path(str(directory))
    pages = staging_dir.glob(globpattern)
    now = datetime.now()
    output = []
    for pdf_file in pages:
        age = now - datetime.fromtimestamp(
            pdf_file.stat().st_mtime)
        if expiration_days and age.days > expiration_days:
            if delete_expired:
                pdf_file.unlink()
        else:
            output.append(str(pdf_file))

    return sorted(output)


def get_output_file(input_file, subfolder, suffix=None):
    if suffix is None:
        suffix = input_file.suffix
    if not suffix.startswith('.'):
        suffix = '.' + suffix
    output_dir = input_file.parent / subfolder
    output_dir.mkdir(exist_ok=True)
    output_file = output_dir / input_file.name
    output_file = output_file.with_suffix(suffix)

    no_change = (
        output_file.exists() and
        output_file.stat().st_mtime > input_file.stat().st_mtime
    )
    return output_file, no_change


@require_binary(GHOSTSCRIPT)
def convert_pdf_to_web(input_file):
    """Compress images and convert to rgb using ghostscript"""
    input_file = pathlib.Path(input_file)
    input_file.resolve()  # Raises FileNotFound
    output_file, no_change = get_output_file(input_file, 'WEB')
    if no_change:
        return output_file

    rgb_profile = pathlib.Path(__file__).parent / 'sRGB.icc'
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
        '-o', output_file,
        input_file,
    ]
    subprocess.run(map(str, args))
    return output_file


@require_binary(CONVERT)
def generate_pdf_preview(input_file, img_format='png', size=300):
    input_file = pathlib.Path(input_file)
    input_file.resolve()  # Raises FileNotFound
    output_file, no_change = get_output_file(
        input_file, img_format.upper(), img_format)
    if no_change:
        return output_file

    args = [
        CONVERT,
        '-density', 160,
        '-colorspace', 'CMYK',
        input_file,
        '-background', 'white',
        '-flatten',
        '-resize', '{}x'.format(size),
        '-format', img_format.strip('.'),
        '-colorspace', 'sRGB',
        output_file,
    ]
    subprocess.run(map(str, args))

    return output_file


def optimize_staging_pages(*args, **kwargs):
    """Optimize all pages"""
    pages = get_staging_pdf_files(*args, **kwargs)
    return [convert_pdf_to_web(pdf) for pdf in pages]


def generate_thumbnails(*args, **kwargs):
    """Create thumbnails"""
    pages = get_staging_pdf_files(*args, **kwargs)
    return [generate_pdf_preview(pdf) for pdf in pages]


def create_web_bundle(filename, *args, **kwargs):
    """Creates a web bundle file"""
    output_file = pathlib.Path(filename)
    output_file.touch()

    pages = [str(p) for p in
             optimize_staging_pages(*args, **kwargs)]

    number_of_pages = len(pages)
    if number_of_pages == 0:
        raise RuntimeWarning('No pages found')

    if number_of_pages % 4 != 0:
        raise RuntimeError('Wrong number of pages %d' % number_of_pages)

    logger.info('{} pages found'.format(number_of_pages))

    args = [
        GHOSTSCRIPT,
        '-q',
        '-o', output_file,
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
    ] + pages

    args = [str(a) for a in args]
    subprocess.run(args)
    return output_file


@shared_task
def create_print_issue_pdf():
    """Create or update pdf for the current issue"""

    issue = current_issue()
    editions = [('', PAGES_GLOB), ('_mag', MAG_PAGES_GLOB)]
    results = []
    for suffix, globpattern in editions:

        pdf_name = OUTPUT_PDF_NAME.format(issue=issue, suffix=suffix)
        issue_name = '{issue.number}/{issue.date.year}{suffix}'.format(
            suffix=suffix, issue=issue)
        logger.info('Creating pdf: {}'.format(issue_name))
        tmp_bundle_file = tempfile.NamedTemporaryFile(suffix='.pdf')
        try:
            create_web_bundle(
                filename=tmp_bundle_file.name, globpattern=globpattern)
        except RuntimeWarning as warning:
            logger.info(str(warning))
            continue
        try:
            # pdf_lookfor = pdf_name.split('.')[0]
            # print(pdf_name, pdf_lookfor)
            print_issue = PrintIssue.objects.get(pdf__endswith=pdf_name)
        except PrintIssue.DoesNotExist:
            print_issue = PrintIssue()
        with open(tmp_bundle_file.name, 'rb') as src:
            pdf_content = ContentFile(src.read())
        print_issue.pdf.save(pdf_name, pdf_content, save=False)
        # print_issue.issue_name = issue_name
        print_issue.save()
        logger.info('New bundle file: {}'.format(pdf_name))
        results.append(pdf_name)
    return results
