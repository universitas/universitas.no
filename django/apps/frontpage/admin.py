""" Admin for frontpage app.  """

from django import forms
from django.contrib import admin
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _

from apps.photo.admin import ThumbAdmin

from .models import FrontpageStory

smallTextArea = forms.Textarea(attrs={'cols': '16', 'rows': '4'})


class FrontpagePublishedFilter(admin.SimpleListFilter):
    title = _('published')
    parameter_name = 'status'

    def lookups(self, request, model_admin):
        """ what will be shown in the sidebar """
        return (
            (None, _('published')),
            ('no', _('unpublished')),
        )

    def queryset(self, request, queryset):

        if self.value() == 'no':
            return queryset.difference(queryset.published())
        else:
            return queryset.published()


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
        'ranking',
    ]
    autocomplete_fields = ['story', 'imagefile']
    list_filter = [FrontpagePublishedFilter]
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

    def get_queryset(self, request):
        return super().get_queryset(request).with_ranking()

    def ranking(self, instance):
        return f'{instance.ranking:.3f}' if instance.ranking else '[unpublished]'

    def for_story(self, instance):
        url = instance.story.get_edit_url()
        style = 'display: block; width:150px;'
        html = f'<a style="{style} "href="{url}">{instance.story}</a>'
        return mark_safe(html)

    def get_changelist_form(self, request, **kwargs):
        return FrontPageListForm
