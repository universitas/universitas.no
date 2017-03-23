import logging
from django.core.management.base import BaseCommand

from apps.core import content_factory
logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Create fake content'

    def add_arguments(self, parser):
        parser.add_argument(
            '--stories', '-s',
            type=int,
            dest='stories',
            default=1,
            help='Number of stories.'
        )
        parser.add_argument(
            '--contributors', '-c',
            type=int,
            dest='contributors',
            default=0,
            help='Number of contributors'
        )
        parser.add_argument(
            '--delete', '-d',
            action='store_true',
            dest='delete_existing',
            default=False,
            help='Delete existing content'
        )

    def handle(self, contributors, stories, delete_existing, verbosity,
               **options):

        content_factory.create_fake_content(contributors, stories,
                                            delete_existing, verbosity)
