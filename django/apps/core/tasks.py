"""Celery tasks"""
from celery.decorators import periodic_task
from datetime import timedelta
import subprocess

import logging
logger = logging.getLogger(__name__)

# @periodic_task(run_every=timedelta(seconds=10))


@periodic_task(run_every=timedelta(seconds=3))
def test_log():
    """ Logs an interesting message! """
    logger.info('fortune!')
    try:
        fortune = subprocess.check_output(['fortune']).decode('utf-8')
        logger.info('fortune %s' % fortune)
    except Exception:
        logger.info('broken')
        logger.exception('error')
