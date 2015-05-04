from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _

class MarkupAppConfig(AppConfig):
    name = 'apps.markup'
    verbose_name = _('Markup')