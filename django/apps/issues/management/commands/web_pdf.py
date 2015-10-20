"""
Find PDF files.
"""

from optparse import make_option
from django.core.management.base import BaseCommand  # ,CommandError
from django.conf import settings

import os
from datetime import datetime
import subprocess
# import re
from glob import glob
from apps.issues.models import PrintIssue, current_issue

import logging
logger = logging.getLogger(__name__)

PDF_STAGING = os.path.join(settings.STAGING_ROOT, 'STAGING', 'PDF')
PDF_FOLDER = os.path.join(settings.STAGING_ROOT, 'pdf')

PDF_MERGE = os.path.join(settings.PROJECT_DIR, 'bin', 'pdf_merge.sh')

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

    def handle(self, *args, **options):
        """ Finds pdf files on disks and creates PrintIssue objects. """
        log = self.stdout.write
        # log = logger.debug

        for code, suffix in (1, ''), (2, '_mag'):
            year, number = current_issue()
            filename = FILENAME_PATTERN.format(
                year=year,
                number=number,
                suffix=suffix,
            )
            files = self.get_staging_pdf_files(code)

            if len(files) == 0:
                log('no files found, %s' % code)
                continue

            if len(files) % 4:
                log('Incorrect number of pages (%d), %s' % (len(files), code))
                continue

            pdf_path = os.path.join(PDF_FOLDER, filename)

            log('\n'.join([PDF_MERGE, pdf_path] + files))

            try:
                issue = PrintIssue.objects.get(pdf__endswith=filename)
            except PrintIssue.DoesNotExist:
                issue = PrintIssue()

            # issue, _ = PrintIssue.objects.get_or_create(pdf='pdf/' + filename)
            name = '{number}/{year}{suffix}'.format(**locals())
            issue.issue_name = name
            issue.pdf.save(pdf_path, save=False)
            issue.save()
