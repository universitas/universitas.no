from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _

class StoriesAppConfig(AppConfig):
    name = 'myapps.stories'
    verbose_name = _('Stories')