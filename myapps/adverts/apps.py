from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _

class AdvertsAppConfig(AppConfig):
    name = 'myapps.adverts'
    verbose_name = _('Adverts')