import logging
logger = logging.getLogger('universitas')

from django.core.management.base import BaseCommand  # , CommandError
# from django.db.models import Count

from myapps.stories.models import Story, Section, StoryType


class Command(BaseCommand):
    help = 'Update all slugs'

    def handle(self, *args, **options):

        for cls in [StoryType, Section, Story]:
            for instance in cls.objects.all():
                instance.save()
                print(instance.pk, instance.slug)
