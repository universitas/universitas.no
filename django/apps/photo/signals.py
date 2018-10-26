import logging

from apps.photo import tasks
from django.conf import settings
from django.db import models
from sorl.thumbnail.helpers import ThumbnailError
from django.dispatch import receiver

# from celery import chain
# from apps.photo import tasks

logger = logging.getLogger(__name__)


@receiver(models.signals.post_save, sender='photo.ImageFile')
def image_post_save(sender, instance, created, update_fields, **kwargs):
    """Schedule autocropping and rebuild thumbnail"""

    if instance.original is None:
        # wait until image was saved with image file
        return
    # Celery tasks immutable signatures
    autocrop_signature = tasks.autocrop_image_file.si(instance.pk)
    post_save_signature = tasks.post_save_task.si(instance.pk)
    if not created:
        old = sender.objects.get(pk=instance.pk)
        if old.stat.get('md5'
                        ) and old.stat.get('md5') != instance.stat.get('md5'):
            # image file has changed. Invalidate thumbnails.
            instance.delete_thumbnails()
    if instance.cropping_method == instance.CROP_PENDING:
        logger.debug('autocrop_signature %s' % instance)
        # chain two task signatures
        (autocrop_signature | post_save_signature).apply_async(countdown=15)
    elif not update_fields:
        post_save_signature.apply_async(countdown=15)


@receiver(models.signals.pre_delete, sender='photo.ImageFile')
def image_pre_delete(sender, instance, **kwargs):
    """Remove original image file and thumbnail"""
    delete_file = settings.DEBUG  # not in production
    try:
        instance.delete_thumbnails(delete_file)
    except ThumbnailError:
        pass
