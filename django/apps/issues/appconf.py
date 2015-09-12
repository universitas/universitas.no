from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _

class IssuesAppConfig(AppConfig):
    name = 'apps.issues'
    verbose_name = _('Issues')