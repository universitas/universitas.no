import autocomplete_light.shortcuts as autocomplete_light
from .models import Contributor
from django.utils.translation import ugettext_lazy as _

# This will generate a PersonAutocomplete class
autocomplete_light.register(Contributor,
    # Just like in ModelAdmin.search_fields
    search_fields=['display_name'],
    attrs={
        # This will set the input placeholder attribute:
        'placeholder': _('Name of person.'),
        # This will set the yourlabs.Autocomplete.minimumCharacters
        # options, the naming conversion is handled by jQuery
        'data-autocomplete-minimum-characters': 2,
    },
    # This will set the data-widget-maximum-values attribute on the
    # widget container element, and will be set to
    # yourlabs.Widget.maximumValues (jQuery handles the naming
    # conversion).
    widget_attrs={
        'data-widget-maximum-values': 5,
        # Enable modern-style widget !
        'class': 'modern-style',
    },
)
