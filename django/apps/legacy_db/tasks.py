"""Celery tasks for legacy db / prodsys"""

from datetime import timedelta
from celery.decorators import periodic_task
from celery.utils.log import get_task_logger
from .export_content_and_images import import_prodsys_content

logger = get_task_logger(__name__)


@periodic_task(run_every=timedelta(seconds=5))
def import_stories_from_prodsys():
    logger.debug('importing stuff')
    import_prodsys_content
