"""
Find PDF files.
"""

from optparse import make_option
from django.core.management.base import BaseCommand  # ,CommandError
from django.conf import settings

import os
import subprocess
# import re
from glob import glob
from apps.issues.models import PrintIssue, current_issue

import logging
logger = logging.getLogger('universitas')

PDF_STAGING = os.path.join(settings.MEDIA_ROOT, 'STAGING', 'PDF')
PDF_FOLDER = os.path.join(settings.MEDIA_ROOT, 'pdf')

PDF_MERGE = os.path.join(settings.BASE_DIR, 'bin', 'pdf_merge.sh')

FILENAME_PATTERN = 'universitas_{year}-{number}{suffix}.pdf'


class Command(BaseCommand):
    help = 'Make web pdf'
    option_list = BaseCommand.option_list + (
        make_option(
            '--replace_existing', '-x',
            action='store_true',
            dest='replace existing',
            default=False,
            help='Replace existing content from previous imports.'
        ),
    )

    def get_staging_pdf_files(self, magazine='1'):
        globpattern = '{folder}/UNI1{version}VER*.pdf'.format(
            folder=PDF_STAGING,
            version=magazine,
        )
        print(globpattern)
        files = glob(globpattern)
        return sorted(files)

    def handle(self, *args, **options):
        """ Finds pdf files on disks and creates PrintIssue objects. """

        for code, suffix in (1, ''), (2, '_mag'):
            year, number = current_issue()
            filename = FILENAME_PATTERN.format(
                year=year,
                number=number,
                suffix=suffix,
                )
            files = self.get_staging_pdf_files(code)

            if len(files) == 0:
                msg = 'no files found, {}'.format(code)
                logger.debug(msg)
                continue

            if len(files) % 4:
                msg = 'Incorrect number of pages ({}), {}'.format(
                    len(files),
                    code)
                logger.debug(msg)
                continue

            pdf_path = os.path.join(PDF_FOLDER, filename)

            args = [PDF_MERGE, pdf_path] + files
            msg = '\n'.join(args)
            logger.debug(msg)
            subprocess.call(args)

            issue, new = PrintIssue.objects.get_or_create(pdf='pdf/'+filename)
            if new:
                name = '{number}/{year}{suffix}'.format(**locals())
                issue.issue_name = name