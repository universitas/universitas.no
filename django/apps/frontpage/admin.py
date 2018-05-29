""" Admin for frontpage app.  """

from apps.photo.admin import ThumbAdmin
from django import forms
from django.contrib import admin
from django.utils.safestring import mark_safe

from .models import FrontpageStory

smallTextArea = forms.Textarea(attrs={'cols': '16', 'rows': '4'})


class FrontPageListForm(forms.ModelForm):
    class Meta:
        widgets = {
            'lede': smallTextArea,
            'headline': smallTextArea,
            'kicker': smallTextArea,
            'html_class': smallTextArea,
            'vignette': forms.TextInput(attrs={'size': '10'}),
            'priority': forms.NumberInput(attrs={'style': 'width: 3em'}),
        }


@admin.register(FrontpageStory)
class FrontpageStoryAdmin(admin.ModelAdmin, ThumbAdmin):
    save_on_top = True
    list_per_page = 15
    list_display = [
        'id',
        'published',
        'order',
        'priority',
        'columns',
        'rows',
        'vignette',
        'kicker',
        'headline',
        'lede',
        'html_class',
        'full_thumb',
        'for_story',
    ]
    ordering = ['-order']
    autocomplete_fields = ['story', 'imagefile']
    list_editable = [
        'priority',
        'kicker',
        'headline',
        'lede',
        'vignette',
        'columns',
        'rows',
        'published',
        'html_class',
    ]
    search_fields = ['headline']

    def for_story(self, instance):
        url = instance.story.get_edit_url()
        style = 'display: block; width:150px;'
        html = f'<a style="{style} "href="{url}">{instance.story}</a>'
        return mark_safe(html)

    def get_changelist_form(self, request, **kwargs):
        return FrontPageListForm
