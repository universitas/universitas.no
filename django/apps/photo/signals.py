from django.db.models.signals import pre_delete, post_save
from django.conf import settings
from sorl import thumbnail
# from apps.photo import tasks

import logging
from apps.photo import tasks
logger = logging.getLogger(__name__)


def image_post_delete(sender, instance, **kwargs):
    """Remove image file and thumbnail"""
    delete_file = not settings.DEBUG  # only in production
    thumbnail.delete(instance.source_file, delete_file=delete_file)


def image_post_save(sender, instance, created, update_fields, **kwargs):
    """Schedule autocropping and rebuild thumbnail"""
    if update_fields:
        logger.debug(f'no task: {str(instance):>40} fields: {update_fields}')
        return
    if not created:
        old = sender.objects.get(pk=instance.pk)
        if old._md5 and old._md5 != instance._md5:
            thumbnail.delete(instance.source_file, delete_file=False)
    if instance.cropping_method == instance.CROP_PENDING:
        tasks.autocrop_image_file.delay(instance.pk)
    tasks.post_save_task.delay(instance.pk)


pre_delete.connect(image_post_delete, sender='photo.ImageFile')
pre_delete.connect(image_post_delete, sender='photo.ProfileImage')
post_save.connect(image_post_save, sender='photo.ImageFile')
post_save.connect(image_post_save, sender='photo.ProfileImage')
