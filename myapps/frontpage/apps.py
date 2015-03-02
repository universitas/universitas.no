from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _

class FrontpageAppConfig(AppConfig):
    name = 'myapps.frontpage'
    verbose_name = _('Frontpage')
