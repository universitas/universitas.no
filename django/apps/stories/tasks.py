"""Celery tasks for stories"""

import logging
from datetime import timedelta

from celery.task import periodic_task
from django.core.cache import cache
from django.db.models import F, Q
from django.utils import timezone

from .models import Story

logger = logging.getLogger(__name__)

UPDATE_SEARCH = timedelta(hours=1)
DEVALUE_HOTNESS = timedelta(hours=1)
SAVE_VISITS = timedelta(minutes=5)


@periodic_task(run_every=UPDATE_SEARCH)
def update_search_task():
    """Update database search index for newly modified stories."""
    Story.objects.filter(
        Q(search_vector=None) |
        Q(modified__gt=timezone.now() - UPDATE_SEARCH * 1.5)
    ).update_search_vector()


@periodic_task(run_every=SAVE_VISITS)
def save_visits_task():
    for key in cache.iter_keys(f'{Story.VISIT_KEY_PREFIX}*'):
        val = int(cache.get(key))
        cache.delete(key)
        pk = int(key.replace(Story.VISIT_KEY_PREFIX, ''))
        try:
            story = Story.objects.get(pk=pk)
        except Story.DoesNotExist:
            logger.info(f'Story {pk} was deleted')
        else:
            story.hit_count = F('hit_count') + val
            story.hot_count = F('hot_count') + 100 * val
            story.save(update_fields=['hit_count', 'hot_count'])
            logger.info(f'{story} was visited {val} times')


@periodic_task(run_every=DEVALUE_HOTNESS)
def devalue_hotness_task():
    """Decrease the hotness rating of all stories."""
    logger.info('decreasing hotness')
    Story.objects.devalue_hotness()
