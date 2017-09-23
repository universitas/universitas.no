import logging

from apps.photo import tasks
from django.conf import settings
from django.db.models.signals import post_save, pre_delete
from sorl import thumbnail

# from celery import chain
# from apps.photo import tasks

logger = logging.getLogger(__name__)


def image_post_delete(sender, instance, **kwargs):
    """Remove image file and thumbnail"""
    delete_file = not settings.DEBUG  # only in production
    thumbnail.delete(instance.source_file, delete_file=delete_file)


def image_post_save(sender, instance, created, update_fields, **kwargs):
    """Schedule autocropping and rebuild thumbnail"""

    # Celery tasks immutable signatures
    autocrop_signature = tasks.autocrop_image_file.si(instance.pk)
    post_save_signature = tasks.post_save_task.si(instance.pk)
    if not created:
        old = sender.objects.get(pk=instance.pk)
        if old._md5 and old._md5 != instance._md5:
            # image file has changed. Invalidate thumbnails.
            thumbnail.delete(instance.source_file, delete_file=False)
    if instance.cropping_method == instance.CROP_PENDING:
        logger.debug('autocrop_signature %s' % instance)
        # chain two task signatures
        (autocrop_signature | post_save_signature).apply_async()
    elif not update_fields:
        post_save_signature.apply_async()


# pre_delete.connect(image_post_delete, sender='photo.ImageFile')
# pre_delete.connect(image_post_delete, sender='photo.ProfileImage')
post_save.connect(image_post_save, sender='photo.ImageFile')
post_save.connect(image_post_save, sender='photo.ProfileImage')
