from django.db.models.signals import pre_delete, post_save
from django.conf import settings
from sorl import thumbnail
from .models import ImageFile, ProfileImage
from .tasks import post_save_task

import logging
logger = logging.getLogger(__name__)


def image_post_delete(sender, instance, **kwargs):
    """Remove image file and thumbnail"""
    logger.info(str(kwargs))
    delete_file = not settings.DEBUG  # only in production
    thumbnail.delete(instance.source_file, delete_file=delete_file)


def image_post_save(sender, instance, **kwargs):
    """Schedule autocropping and rebuild thumbnail"""
    logger.info(str(kwargs))
    post_save_task.delay(instance)


pre_delete.connect(image_post_delete, sender=ImageFile)
pre_delete.connect(image_post_delete, sender=ProfileImage)
post_save.connect(image_post_save, sender=ImageFile)
post_save.connect(image_post_save, sender=ProfileImage)
