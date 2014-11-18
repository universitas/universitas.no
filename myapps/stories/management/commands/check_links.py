from optparse import make_option
import logging
logger = logging.getLogger('universitas')

from django.core.management.base import BaseCommand  # , CommandError
from myapps.stories.models import InlineLink


class Command(BaseCommand):
    help = ''
    option_list = BaseCommand.option_list + (
        make_option(
            '--new', '-n',
            action='store_true',
            dest='new links',
            default=False,
            help='Only check new links'
        ),
    )

    def handle(self, *args, **options):

        status_in = None

        if options['new links']:
            status_in = [None]

        self._check_links(status_in=status_in)

        self.stdout.write('Successfully imported content')

    def _check_links(self, status_in=None):
        links_to_check = InlineLink.objects.all()
        if status_in:
            links_to_check = InlineLink.objects.filter(status_code__in=status_in)
        else:
            links_to_check = InlineLink.objects.all()

        self.stdout.write('Checking {} links'.format(links_to_check.count()))

        for link in links_to_check:
            link.check_link()
