"""Celery tasks"""
from celery.decorators import periodic_task
from celery.utils.log import get_task_logger
from datetime import timedelta
import subprocess

logger = get_task_logger(__name__)

@periodic_task(run_every=timedelta(hours=1))
def test_log():
    """ Logs an interesting message! """
    fortune = subprocess.check_output(['fortune'])
    logger.warn("\n%s" % fortune)
