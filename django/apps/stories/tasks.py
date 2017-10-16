"""Celery tasks for stories"""

import logging
from datetime import timedelta

from celery.task import periodic_task
from django.db.models import Q
from django.utils import timezone

from .models import Story

logger = logging.getLogger(__name__)

UPDATE_SEARCH = timedelta(hours=1)
DEVALUE_HOTNESS = timedelta(hours=1)


@periodic_task(run_every=UPDATE_SEARCH)
def update_search():
    """Update search index for stories"""
    Story.objects.filter(
        Q(search_vector=None) |
        Q(modified__gt=timezone.now() - UPDATE_SEARCH * 1.5)
    ).update_search_vector()


@periodic_task(run_every=DEVALUE_HOTNESS)
def devalue_hotness():
    """ Decrease the hotness rating of all stories """
    logger.info('decreasing hotness')
    Story.objects.devalue_hotness()
