"""Celery tasks for photos"""
import logging
from datetime import timedelta
from pathlib import Path
from typing import BinaryIO, List

from apps.core.staging import new_staging_images
from celery import shared_task
from celery.task import periodic_task
from django.core.files import File
from utils.model_fields import AttrDict

from . import file_operations as ops
from .cropping.boundingbox import CropBox
from .cropping.crop_detector import Feature, HybridDetector
from .models import ImageFile

logger = logging.getLogger(__name__)


def determine_cropping_method(features: List[Feature]) -> int:
    """Determines which cropping method label to use"""
    if 'face' in features[-1].label:
        if len(features) == 1:  # single face
            return ImageFile.CROP_PORTRAIT
        return ImageFile.CROP_FACES  # multiple faces
    return ImageFile.CROP_FEATURES  # no faces


@shared_task
def autocrop_image_file(pk: int) -> bool:
    try:
        instance = ImageFile.objects.get(pk=pk)
    except ImageFile.DoesNotExist:
        return False
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
        left, top, right, bottom = sum(features)  # type: ignore
        crop_box = CropBox(left, top, right, bottom, x, y)
        cropping_method = determine_cropping_method(features)
    instance.crop_box = crop_box
    instance.cropping_method = cropping_method
    logger.debug(
        '%s %s %s' %
        (instance, crop_box, instance.get_cropping_method_display())
    )
    instance.save(update_fields=['crop_box', 'cropping_method'])
    return True


@shared_task
def post_save_task(pk: int) -> bool:
    try:
        instance = ImageFile.objects.get(pk=pk)
    except ImageFile.DoesNotExist:
        logger.debug(f'imagefile {pk} does not exist')
        return False
    instance.build_thumbs()
    instance.calculate_hashes()
    # note: the last step re-saves the image.
    # Should not trigger this task again.
    return True


@periodic_task(run_every=timedelta(hours=1))
def update_image_description() -> None:
    return ImageFile.objects.update_descriptions()


@periodic_task(run_every=timedelta(minutes=10))
def clean_up_pending_autocrop() -> int:
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
    return len(image_pks)


@shared_task
def new_image_file(fp: BinaryIO, filename: str) -> ImageFile:
    """New image file"""
    return ImageFile()


@periodic_task(run_every=timedelta(minutes=1))
def import_staging_images(max_age=timedelta(minutes=10)) -> List[Path]:
    """
    Check staging directories for new or changed image files, and save to
    database.
    """
    files_saved: List[Path] = []
    for file in new_staging_images(max_age=max_age):
        if import_image(file):
            files_saved.append(file)
    return files_saved


def import_image(file: Path) -> bool:
    """Import image file from staging directory if it passes checks.

    - the file is a valid image file
    - there's no image with the same md5 in the database
    - there's no larger image with the same image hash

    returns False if the checks failed and image was not imported
    """
    if not ops.valid_image(file):
        return False

    img = ImageFile(
        imagehash=ops.get_imagehash(file),
        stat=AttrDict(
            md5=ops.get_md5(file),
            size=ops.get_filesize(file),
            mtime=ops.get_mtime(file),
        )
    )
    same_md5 = img.similar('md5').first()
    if same_md5:
        return False

    same_imghash = img.similar('imagehash').first()
    if same_imghash:
        if same_imghash.stat.size > img.stat.size:
            return False  # do not overwrite
        else:
            img.pk = same_imghash.pk  # overwrite smaller file

    img.original.save(
        file.name,
        File(file.open('rb')),
        save=True,
    )

    logger.debug(f'saved: {img}')
    return True
