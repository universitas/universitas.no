"""Celery tasks for photos"""
from celery.decorators import periodic_task
from celery.utils.log import get_task_logger
from datetime import timedelta
from django.conf import settings
import os
import glob
# import subprocess

logger = get_task_logger(__name__)

IMAGE_STAGING = os.path.join(settings.STAGING_ROOT 'STAGING', 'IMAGES')
PDF_STAGING = os.path.join(settings.STAGING_ROOT 'STAGING', 'IMAGES')

# @periodic_task(run_every=timedelta(hours=6))
# @periodic_task(run_every=timedelta(minutes=1))
def new_photos_in_staging():
    """Registers new photos in staging"""


def get_new_images(folder, since=60):


def get_staging_pdf_files():
    globpattern = '{folder}/UNI1{version}VER*.pdf'.format(
        folder=PDF_STAGING,
        version=magazine,
    )
    all_files = glob(globpattern)
    new_files = []
    for pdf_file in all_files:
        age = datetime.now() - \
            datetime.fromtimestamp(os.path.getctime(pdf_file))
        if age.days > 4:
            os.remove(pdf_file)
        else:
            new_files.append(pdf_file)
    return sorted(new_files)