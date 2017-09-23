"""Celery tasks for legacy db / prodsys"""

import logging
from datetime import timedelta

from celery.task import periodic_task

from .models import Story

logger = logging.getLogger(__name__)


@periodic_task(run_every=timedelta(hours=1))
def devalue_hotness():
    """ Decrease the hotness rating of all stories """
    logger.info('decreasing hotness')
    Story.objects.devalue_hotness()
