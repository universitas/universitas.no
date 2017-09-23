"""Celery tasks for photos"""
import logging
import os
from datetime import timedelta

from apps.core.staging import new_staging_images
from celery import shared_task
from celery.task import periodic_task

from .cropping.boundingbox import CropBox
from .cropping.crop_detector import HybridDetector
from .models import ImageFile, upload_image_to

logger = logging.getLogger(__name__)


def determine_cropping_method(features):
    if 'face' in features[-1].label:
        if len(features) == 1:
            return ImageFile.CROP_PORTRAIT
        return ImageFile.CROP_FACES
    return ImageFile.CROP_FEATURES


@shared_task
def autocrop_image_file(pk):
    instance = ImageFile.objects.get(pk=pk)
    imgdata = instance.large.read()  # should be at least 600 x 600 px
    if instance.is_profile_image():
        detector = HybridDetector(n=1)
    else:
        detector = HybridDetector(n=10)
    features = detector.detect_features(imgdata)
    if not features:
        crop_box = CropBox.basic()
        cropping_method = ImageFile.CROP_NONE
    else:
        x, y = features[0].center
        left, top, right, bottom = sum(features)
        crop_box = CropBox(left, top, right, bottom, x, y)
        cropping_method = determine_cropping_method(features)
    instance.crop_box = crop_box
    instance.cropping_method = cropping_method
    logger.debug(
        '%s %s %s' %
        (instance, crop_box, instance.get_cropping_method_display())
    )
    instance.save(update_fields=['crop_box', 'cropping_method'])


@shared_task
def post_save_task(pk):
    instance = ImageFile.objects.get(pk=pk)
    instance.build_thumbs()
    instance.calculate_hashes()  # this saves as well


@periodic_task(run_every=timedelta(minutes=10))
def clean_up_pending_autocrop():
    # In case some images have ended up in limbo
    limit = 200  # do in batches
    image_pks = ImageFile.objects.filter(
        cropping_method=ImageFile.CROP_PENDING
    ).order_by('?').values_list(
        'pk', flat=True
    )

    for image_pk in image_pks[:limit]:
        try:
            autocrop_image_file(image_pk)
            post_save_task(image_pk)
        except Exception as err:
            logger.exception(f'pending autocrop broke: {image_pk}')
            ImageFile.objects.filter(pk=image_pk).update(
                cropping_method=ImageFile.CROP_NONE
            )


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
                    source_file__endswith='/' + os.path.basename(dest)
                )
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
