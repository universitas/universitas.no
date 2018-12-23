import logging

from django.core.management.base import BaseCommand

from apps.stories.models import Story

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Devalue hotness of all Stories.'

    def handle(self, *args, **options):
        Story.objects.devalue_hotness()
