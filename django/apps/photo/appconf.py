from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class PhotoAppConfig(AppConfig):
    name = 'apps.photo'
    verbose_name = _('Photo')

    def ready(self):
        from . import signals  # noqa
