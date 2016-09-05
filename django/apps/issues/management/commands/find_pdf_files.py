"""
Find and add existing pdf issues to the database.
"""

from django.core.management.base import BaseCommand  # ,CommandError
from django.conf import settings

import os
import re
from glob import glob
from apps.issues.models import PrintIssue

import logging
logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Create print issues from pdf files.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--replace_existing', '-x',
            action='store_true',
            dest='replace existing',
            default=False,
            help='Replace existing content from previous imports.'
        )

    def handle(self, *args, **options):

        if options['replace existing']:
            PrintIssue.objects.all().delete()

        self.import_issues_from_file_system()

    def import_issues_from_file_system(self):
        """ Finds pdf files on disks and creates PrintIssue objects. """
        os.chdir(settings.MEDIA_ROOT)
        files = glob('pdf/uni*.pdf')
        msg = 'found {} files in pdf folder {}/pdf'.format(
            len(files), os.curdir)
        self.stdout.write(msg)
        counter = 0

        for path in files:
            issue, new = PrintIssue.objects.get_or_create(pdf=path)
            if new:
                counter += 1
                match = re.match(
                    r'^.*(?P<year>\d{4})-(?P<number>.*)\.pdf$', path)
                if match:
                    name = '{number}/{year}'.format(**match.groupdict())
                else:
                    name = os.path.basename(path)

                issue.issue_name = name
                issue.get_thumbnail()

                logger.info(
                    'new pdf found {name} {filename}'.format(
                        filename=path,
                        name=name))

        if counter:
            msg = 'Successfully imported {} pdf files'.format(counter)
        else:
            msg = 'No new pdf files found.'

        self.stdout.write(msg)
