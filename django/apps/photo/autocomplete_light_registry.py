import autocomplete_light.shortcuts as autocomplete_light
from .models import ImageFile, ProfileImage
from django.utils.translation import ugettext_lazy as _

# This will generate a PersonAutocomplete class
kwargs = dict(
    search_fields=['source_file', ],
    order_by='-modified',
    attrs={
        # This will set the input placeholder attribute:
        'placeholder': _('Filename'),
        # This will set the yourlabs.Autocomplete.minimumCharacters
        # options, the naming conversion is handled by jQuery
        'data-autocomplete-minimum-characters': 2,
    },
    # This will set the data-widget-maximum-values attribute on the
    # widget container element, and will be set to
    # yourlabs.Widget.maximumValues (jQuery handles the naming
    # conversion).
    widget_attrs={
        'data-widget-maximum-values': 10,
        # Enable modern-style widget !
        'class': 'modern-style',
    },
)

autocomplete_light.register(ImageFile, **kwargs)
autocomplete_light.register(ProfileImage, **kwargs)
