import logging

from apps.frontpage.models import FrontpageStory
from apps.stories.models import Story
from django.core.management.base import BaseCommand

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Populates frontpage'

    def add_arguments(self, parser):
        parser.add_argument(
            '--number',
            '-n',
            type=int,
            dest='number',
            default=0,
            help='Number of stories.'
        )
        parser.add_argument(
            '--delete',
            '-d',
            action='store_true',
            dest='delete',
            default=False,
            help='Delete old stories'
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
                FrontpageStory.objects.create_for_story(story)
                self.stdout.write(story.title)
