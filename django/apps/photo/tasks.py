"""Celery tasks for photos"""
import os
from datetime import timedelta

from celery.decorators import periodic_task
from celery import shared_task

from sorl import thumbnail

from apps.core.staging import new_staging_images
from .models import upload_image_to, ImageFile, ProfileImage
from .cropping.boundingbox import CropBox
from .cropping.crop_detector import HybridDetector

import logging
logger = logging.getLogger(__name__)


def determine_cropping_method(features):
    if 'face' in features[-1].label:
        if len(features) == 1:
            return ImageFile.CROP_PORTRAIT
        return ImageFile.CROP_FACES
    return ImageFile.CROP_FEATURES


def autocrop(instance):
    with instance.source_file as img:
        imgdata = img.read()
    if isinstance(instance, ProfileImage):
        detector = HybridDetector(n=1)
    else:
        detector = HybridDetector(n=10)
    features = detector.detect_features(imgdata)
    if not features:
        return CropBox.basic(), ImageFile.CROP_NONE
    x, y = features[0].center
    left, top, right, bottom = sum(features)
    cropbox = CropBox(left, top, right, bottom, x, y)
    cropping_method = determine_cropping_method(features)
    return cropbox, cropping_method


@shared_task(serializer='pickle')
def post_save_task(instance):
    # logger.info(instance.get_cropping_method_display())
    if instance.cropping_method == instance.CROP_PENDING:
        box, method = autocrop(instance)
        instance.cropping_method = method
        logger.info('autocrop {i.pk} {i} {m}'.format(
            i=instance, m=instance.get_cropping_method_display()))
        instance.crop_box = box
        assert instance.cropping_method != instance.CROP_PENDING
        instance.save(update_fields=('crop_box', 'cropping_method'))

    else:
        # delete thumbnail
        thumbnail.delete(instance.source_file, delete_file=False)
        # rebuild thumbnails
        instance.thumb()
        instance.preview()
        logger.info('rebuilt thumbs for %d %s' % (instance.pk, instance))


@periodic_task(run_every=timedelta(hours=1))
def clean_up_pending_autocrop():
    # In case some images have ended up in limbo
    pending_images = ImageFile.objects.filter(
        cropping_method=ImageFile.CROP_PENDING
    )
    for image in pending_images:
        post_save_task(image)


@periodic_task(run_every=timedelta(minutes=1))
def import_staging_images(max_age=timedelta(minutes=10)):
    """
    Check staging directories for new or changed image files, and save to
    database.
    """
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
