"""Celery tasks for photos"""
from celery.decorators import periodic_task
from celery.utils.log import get_task_logger
from datetime import timedelta, datetime
from django.conf import settings
import os
import glob
# import subprocess

logger = get_task_logger(__name__)

# @periodic_task(run_every=timedelta(hours=6))
# @periodic_task(run_every=timedelta(minutes=1))


