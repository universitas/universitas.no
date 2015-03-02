from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _

class MarkupAppConfig(AppConfig):
    name = 'myapps.markup'
    verbose_name = _('Markup')