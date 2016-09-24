# -*- coding: utf-8 -*-
"""
Configuration for the task runner celery
"""

from celery import Celery
from django.conf import settings

celery_app = Celery('core')

# Using a string here means the worker will not have to
# pickle the object when using Windows.
celery_app.config_from_object('django.conf:settings')
celery_app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

@celery_app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
