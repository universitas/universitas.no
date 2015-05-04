from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _

class ContributorsAppConfig(AppConfig):
    name = 'apps.contributors'
    verbose_name = _('Contributors')