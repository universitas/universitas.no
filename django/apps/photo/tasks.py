"""Celery tasks for photos"""
import logging
import re
import subprocess
from datetime import timedelta
from pathlib import Path
from typing import BinaryIO, List

from celery import shared_task
from celery.task import periodic_task

from apps.core import staging
from apps.issues.models import current_issue
from django.conf import settings
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


@periodic_task(run_every=timedelta(hours=24))
def update_image_descriptions() -> int:
    """Add descriptions to images that doesn't have it already"""

    def add_description(image_file) -> str:
        """Populates `description` with relevant content from related models"""
        if image_file.is_profile_image():
            if image_file.person.count():
                return image_file.person.first().display_name
            else:
                return ''
        else:
            cap_list = image_file.storyimage_set.values_list(
                'caption',
                flat=True,
            )
            captions = [re.sub(r'/s+', ' ', c.strip()) for c in cap_list]
            captions = list(set(captions))
            return '\n'.join(captions)[:1000]

    count = 0
    qs = ImageFile.objects.filter(description='')
    profile_images = qs.exclude(person=None)
    story_images = qs.filter(storyimage__caption__regex='.')
    for image_file in (profile_images | story_images):
        description = add_description(image_file)
        if image_file.description != description:
            image_file.description = description
            image_file.save(update_fields=['description'])
            count += 1
    return count


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


@shared_task
def upload_imagefile_to_desken(pk, target=None):
    """Upload imagefile to desken server."""
    # rsync -azv --progress  --include='UNI*000.pdf' --exclude='*'
    if target is None:
        target = Path(f'{current_issue().number}') / 'Prodsys'
    outdir = staging.get_staging_dir('OUT')
    outdir.mkdir(exist_ok=True)
    image = ImageFile.objects.get(pk=pk)
    dest = copy_image_to_local_filesystem(image, outdir)
    remote_path = Path(settings.TASSEN_DESKEN_PATH) / target
    remote_login = settings.TASSEN_DESKEN_LOGIN
    desken = f'{remote_login}:{remote_path}/'
    subprocess.check_call(['ssh', remote_login, 'mkdir', '-p', remote_path])
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
