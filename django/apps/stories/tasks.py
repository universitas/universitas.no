"""Celery tasks for legacy db / prodsys"""

from datetime import timedelta
from celery.decorators import periodic_task
from .models import Story

import logging
logger = logging.getLogger(__name__)


@periodic_task(run_every=timedelta(hours=1))
def devalue_hotness():
    """ Decrease the hotness rating of all stories """
    logger.info('decreasing hotness')
    Story.objects.devalue_hotness()
