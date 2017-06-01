from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class ApiAppConfig(AppConfig):
    name = 'api'
    verbose_name = _('api')
