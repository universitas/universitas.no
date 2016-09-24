"""
Create pdf issue from pages.
"""

from django.core.management.base import BaseCommand  # ,CommandError
from apps.issues import tasks


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
        tasks.create_print_issue_pdf()
