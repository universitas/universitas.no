"""Celery tasks for photos"""
from datetime import timedelta
import logging
from pathlib import Path
import subprocess
from typing import List

from PIL import Image
from celery import shared_task
from celery.task import periodic_task
from django.conf import settings

from apps.core import staging
from apps.issues.models import current_issue

from .cropping.boundingbox import CropBox
from .cropping.crop_detector import Feature, HybridDetector
from .models import ImageFile

logger = logging.getLogger(__name__)


@shared_task(ignore_result=True)
def process_image_upload(pk: int, temporary_file: str) -> bool:
    """Process uploaded files"""
    imagefile = Path(temporary_file)
    if not imagefile.exists():
        msg = f'temporary image {imagefile} does not exist'
        logger.error(msg)
        return False
    try:
        instance = ImageFile.objects.get(pk=pk)
    except ImageFile.DoesNotExist:
        logger.warning(f'ImageFile id: {pk} does not exist')
        return False
    logger.debug(f'process image start: {instance} {instance.dimensions}')
    if instance.original:
        msg = f'ImageFile {instance} has an original'
        logger.warning(msg)
        return False
    try:
        instance.process_uploaded_file(Image.open(imagefile))
    except Exception:
        logger.exception('processing failed')
    instance.save()
    imagefile.unlink()  # clean up
    logger.debug(f'process image finish: {instance} {instance.dimensions}')
    return True


@shared_task(ignore_result=True)
def autocrop_image_file(pk: int) -> bool:
    try:
        instance = ImageFile.objects.get(pk=pk)
    except ImageFile.DoesNotExist:
        return False
    if not instance.original:
        logger.warning(f'Try to autocrop ImageFile with no file: {pk}')
        return False
    if instance.is_profile_image:
        detector = HybridDetector(n=1)
    else:
        detector = HybridDetector(n=10)
    source_image = instance.large  # at least 600 x 600 pixels
    features = detector.detect_features(source_image.read())
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


@shared_task(ignore_result=True)
def post_save_task(pk: int) -> bool:
    try:
        instance = ImageFile.objects.get(pk=pk)
    except ImageFile.DoesNotExist:
        logger.debug(f'imagefile {pk} does not exist')
        return False
    if not instance.original:
        return
    instance.build_thumbs()
    instance.calculate_hashes()
    return True


def determine_cropping_method(features: List[Feature]) -> int:
    """Determines which cropping method label to use"""
    if 'face' in features[-1].label:
        if len(features) == 1:  # single face
            return ImageFile.CROP_PORTRAIT
        return ImageFile.CROP_FACES  # multiple faces
    return ImageFile.CROP_FEATURES  # no faces


@periodic_task(run_every=timedelta(minutes=10))
def clean_up_pending_autocrop() -> int:
    # In case some images have ended up in limbo
    limit = 200  # do in batches
    image_pks = ImageFile.objects.filter(
        cropping_method=ImageFile.CROP_PENDING
    ).exclude(
        original=None,
    ).order_by('?').values_list(
        'pk', flat=True
    )[:limit]

    for image_pk in image_pks[:limit]:
        try:
            autocrop_image_file(image_pk)
            post_save_task(image_pk)
        except Exception:
            logger.exception(f'pending autocrop broke: {image_pk}')
            ImageFile.objects.filter(pk=image_pk).update(
                cropping_method=ImageFile.CROP_NONE
            )
    return len(image_pks)


@shared_task(ignore_result=True)
def upload_imagefile_to_desken(pk, target=None):
    """Upload imagefile to desken server."""
    # rsync -azv --progress  --include='UNI*000.pdf' --exclude='*'
    if target is None:
        target = Path(f'{current_issue().number:0>2}') / 'Prodsys'
    outdir = staging.get_staging_dir('OUT')
    outdir.mkdir(exist_ok=True)
    image = ImageFile.objects.get(pk=pk)
    dest = copy_image_to_local_filesystem(image, outdir)
    remote_path = Path(settings.TASSEN_DESKEN_PATH) / target
    remote_login = settings.TASSEN_DESKEN_LOGIN
    desken = f'{remote_login}:{remote_path}/'
    subprocess.check_call([
        '/usr/bin/ssh', remote_login, 'mkdir', '-p', remote_path
    ])
    args = [
        'rsync',
        '-az',
        f'{dest}',
        f'{desken}',
    ]
    logger.debug(f'call rsync: {args}')
    subprocess.check_call(args)


def copy_image_to_local_filesystem(image, dest=Path('/var/media/')) -> None:
    """Download file for development server"""
    path = dest / image.filename
    if path.exists():
        return path
    data = image.original.file.read()
    path.parent.mkdir(0o775, True, True)
    path.write_bytes(data)
    path.chmod(0o660)
    return path
