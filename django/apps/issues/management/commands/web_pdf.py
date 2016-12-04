"""
Create pdf issue from pages.
"""

import os
import logging
from datetime import datetime
import subprocess
# import re
from glob import glob

from django.core.management.base import BaseCommand  # ,CommandError
from django.conf import settings
from django.core.files.base import ContentFile

from apps.issues.models import PrintIssue, current_issue

PDF_STAGING = os.path.join(settings.STAGING_ROOT, 'STAGING', 'PDF')
PDF_FOLDER = os.path.join(settings.STAGING_ROOT, 'pdf')

PDF_MERGE = os.path.join(settings.PROJECT_DIR, 'bin', 'pdf_merge.sh')

FILENAME_PATTERN = 'universitas_{issue.date.year}-{issue.number}{suffix}.pdf'


class Command(BaseCommand):
    help = 'Make web pdf'

    def add_arguments(self, parser):
        parser.add_argument(
            '--replace_existing', '-x',
            action='store_true',
            dest='replace existing',
            default=False,
            help='Replace existing content from previous imports.',
        )

    def handle(self, *args, **options):
        # print(options)
        # if int(options['verbosity']) > 1:
        #     logger = logging.getLogger('console')
        # else:
        logger = logging.getLogger(__name__)
        bundle_pdf(current_issue(), logger)


def get_staging_pdf_files(magazine='1'):
    globpattern = '{folder}/UNI1{version}VER*.pdf'.format(
        folder=PDF_STAGING,
        version=magazine,
    )
    all_files = glob(globpattern)
    new_files = []
    for pdf_file in all_files:
        age = datetime.now() - \
            datetime.fromtimestamp(os.path.getctime(pdf_file))
        if age.days > 4:
            os.remove(pdf_file)
        else:
            new_files.append(pdf_file)
    return sorted(new_files)


def bundle_pdf(for_issue, logger):
    """ Finds pdf files on disks and creates PrintIssue objects. """
    for code, suffix in (1, ''), (2, '_mag'):
        filename = FILENAME_PATTERN.format(
            issue=for_issue,
            suffix=suffix,
        )
        files = get_staging_pdf_files(code)

        if len(files) == 0:
            logger.info('no files found, %s' % code)
            continue

        if len(files) % 4:
            logger.info(
                'Incorrect number of pages (%d), %s' %
                (len(files), code))
            continue

        pdf_path = os.path.join(PDF_FOLDER, filename)

        args = [PDF_MERGE, pdf_path] + files
        logger.debug('\n'.join(args))
        subprocess.call(args)

        try:
            issue = PrintIssue.objects.get(pdf__endswith=filename)
        except PrintIssue.DoesNotExist:
            issue = PrintIssue()

        name = '{issue.number}/{issue.date.year}{suffix}'.format(
            suffix=suffix, issue=for_issue)
        with open(pdf_path, 'rb') as src:
            content = ContentFile(src.read())
        issue.pdf.save(filename, content)
        # issue.issue_name = name
        # issue.save()
