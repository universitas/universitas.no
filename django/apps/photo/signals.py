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


def image_post_save(sender, instance, **kwargs):
    """Schedule autocropping and rebuild thumbnail"""
    tasks.post_save_task.delay(instance)


pre_delete.connect(image_post_delete, sender='photo.ImageFile')
pre_delete.connect(image_post_delete, sender='photo.ProfileImage')
post_save.connect(image_post_save, sender='photo.ImageFile')
post_save.connect(image_post_save, sender='photo.ProfileImage')
