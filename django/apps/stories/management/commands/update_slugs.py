from apps.stories.models import Section, Story, StoryType
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Update all slugs'

    def handle(self, *args, **options):

        for cls in [StoryType, Section, Story]:
            for instance in cls.objects.all():
                instance.save()
                print(instance.pk, instance.slug)
