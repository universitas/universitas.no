# -*- coding: utf-8 -*-
"""Celery tasks for photos"""
import os
# import logging
from datetime import timedelta

from celery.decorators import periodic_task
from celery import shared_task
from celery.utils.log import get_task_logger

from .models import upload_image_to, ImageFile, ProfileImage
from apps.core.staging import new_staging_images
from .autocrop import autocrop

logger = get_task_logger(__name__)


@shared_task()
def update_image_crop(args):
    image_pk, left, top, diameter, method = args
    try:
        img = ImageFile.objects.get(pk=image_pk)
    except ImageFile.DoesNotExist:
        logger.warning('image with pk %s not found' % image_pk)
    else:
        img.cropping_method = method
        img.cropping = (left, top, diameter)
        img.save()


@shared_task()
def detect_crop(image_pk):
    """placeholder"""
    try:
        img = ImageFile.objects.get(pk=image_pk)
    except ImageFile.DoesNotExist:
        logger.warning('image with pk %s not found' % image_pk)
        return None
    else:
        img = ImageFile.objects.get(pk=image_pk)
        args = (image_pk, *autocrop(img))
        logger.info('new crop is {}'.format(args))
        return args


@periodic_task(run_every=timedelta(minutes=1))
def import_staging_images(max_age=timedelta(minutes=10)):
    directory, files = new_staging_images(max_age=max_age)
    files_saved = []
    for file in files:
        full_path = os.path.join(directory, file)
        logger.debug(full_path)
        dest = upload_image_to(ImageFile, file)
        try:
            try:
                img = ImageFile.objects.get(
                    source_file__endswith='/' + os.path.basename(dest))
            except ImageFile.MultipleObjectsReturned:
                img = ImageFile.objects.get(source_file=dest)
        except ImageFile.DoesNotExist:
            img = ImageFile()
        was_saved = img.save_local_image_as_source(full_path)
        if was_saved:
            msg = 'saved: %s' % img.source_file
            logger.debug(msg)
            files_saved.append(file)

    return files_saved or None
