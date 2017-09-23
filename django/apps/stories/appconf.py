from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _
from watson import search as watson


class StoriesAppConfig(AppConfig):
    name = 'apps.stories'
    verbose_name = _('Stories')

    def ready(self):
        Story = self.get_model('Story')
        watson.register(Story.objects.published())
