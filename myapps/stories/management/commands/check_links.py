from optparse import make_option
import logging
logger = logging.getLogger('universitas')

from django.core.management.base import BaseCommand  # , CommandError
from django.db.models import Count
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

    def _check_links(self, status_in=None):
        links_to_check = InlineLink.objects.all()
        if status_in:
            links_to_check = InlineLink.objects.filter(status_code__in=status_in)
        else:
            links_to_check = InlineLink.objects.all()

        self.stdout.write('Checking {} links'.format(links_to_check.count()))

        for link in links_to_check:
            link.check_link(save_if_changed=True)

        self.stdout.write('Checked {} links'.format(links_to_check.count()))
        link_statuses = InlineLink.objects.values('status_code').annotate(count=Count('status_code'))
        for status in link_statuses:
            self.stdout.write('{count} - {status_code}'.format(**status))
