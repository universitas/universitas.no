from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _

class FrontpageAppConfig(AppConfig):
    name = 'apps.frontpage'
    verbose_name = _('Frontpage')
