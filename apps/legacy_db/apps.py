from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _

class LegacyDbAppConfig(AppConfig):
    name = 'apps.legacy_db'
    verbose_name = _('Legacy Website')