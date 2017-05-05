"""Celery tasks for legacy db / prodsys"""

from datetime import timedelta
from celery.task import periodic_task
from celery.utils.log import get_task_logger
from .export_content_and_images import import_prodsys_content

logger = get_task_logger(__name__)


@periodic_task(run_every=timedelta(minutes=1))
def import_stories_from_prodsys(**kwargs):
    """ Get stories from prodsys when they are ready for web """
    import_prodsys_content(**kwargs)
