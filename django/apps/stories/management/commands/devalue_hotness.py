# -*- coding: utf-8 -*-
"""Devalue hotness by 10%"""
import logging

from apps.stories.models import Story
from django.core.management.base import BaseCommand

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Devalue hotness of all Stories.'

    def handle(self, *args, **options):
        Story.objects.devalue_hotness()
