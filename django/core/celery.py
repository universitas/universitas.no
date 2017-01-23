# -*- coding: utf-8 -*-
"""
Configuration for the task runner celery
"""

from celery import Celery
from django.conf import settings

celery = Celery('core')
celery.config_from_object('django.conf:settings')
celery.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
