import autocomplete_light
from .models import AdFormat, Customer, AdChannel
from django.utils.translation import ugettext_lazy as _

autocomplete_light.register(AdFormat,
    search_fields=['name', 'width', 'height'],
    attrs={
        'placeholder': _('add more'),
        'data-autocomplete-minimum-characters': 1,
    },
    widget_attrs={
        'data-widget-maximum-values': 10,
        'class': 'modern-style',
    },
)

autocomplete_light.register(AdChannel,
    search_fields=['name', 'description'],
    attrs={
        'placeholder': _('add more'),
        'data-autocomplete-minimum-characters': 1,
    },
    widget_attrs={
        'data-widget-maximum-values': 10,
        'class': 'modern-style',
    },
)

autocomplete_light.register(Customer,
    search_fields=['name', 'contact_info'],
    attrs={
        'placeholder': _('choose customer'),
        'data-autocomplete-minimum-characters': 1,
    },
    widget_attrs={
        'data-widget-maximum-values': 10,
        'class': 'modern-style',
    },
)