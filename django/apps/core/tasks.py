"""Celery tasks"""
from celery.decorators import periodic_task
from celery.utils.log import get_task_logger
from datetime import timedelta
import subprocess

logger = get_task_logger(__name__)

# @periodic_task(run_every=timedelta(seconds=10))
@periodic_task(run_every=timedelta(hours=6))
def test_log():
    """ Logs an interesting message! """
    fortune = subprocess.check_output(['fortune']).decode('utf-8')
    logger.info("\n%s" % fortune)
