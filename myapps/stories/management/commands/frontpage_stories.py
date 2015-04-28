from optparse import make_option
import logging
logger = logging.getLogger('universitas')

from django.core.management.base import BaseCommand  # , CommandError
# from django.db.models import Count

from myapps.stories.models import Story
from myapps.frontpage.models import FrontpageStory


class Command(BaseCommand):
    help = 'Populates frontpage'
    option_list = BaseCommand.option_list + (
        make_option(
            '--number', '-n',
            type='int',
            dest='number',
            default=0,
            help='Number of stories.'
        ),
        make_option(
            '--delete', '-d',
            action='store_true',
            dest='delete',
            default=False,
            help='Delete old stories'
        ),
    )

    def handle(self, *args, **options):

        if options['delete']:
            FrontpageStory.objects.all().delete()

        stories = Story.objects.published().order_by('publication_date')
        counter = 0
        limit = options.get('number')

        for story in stories:
            if limit and counter > limit:
                break
            else:
                counter += 1
            if story.frontpagestory_set.count() == 0:
                FrontpageStory.objects.autocreate(story=story)
                self.stdout.write(story.title)