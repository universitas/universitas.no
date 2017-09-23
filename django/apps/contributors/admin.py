""" Admin for contributors app.  """

from apps.stories.admin import BylineInline
from autocomplete_light.forms import modelform_factory
from django.contrib import admin
from django.utils import timezone
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _

from .models import Contributor, Position, Stint

# from django.template import Template
# from django.utils.safestring import mark_safe


class StintInline(
    admin.TabularInline,
):
    model = Stint
    fields = ['position', 'start_date', 'end_date']
    extra = 1


@admin.register(Contributor)
class ContributorAdmin(admin.ModelAdmin):

    form = modelform_factory(Contributor, exclude=())

    list_display = (
        'display_name',
        'bylines_count',
        'verified',
        'status',
    )

    list_editable = ('verified', )

    search_fields = ('display_name', )

    inlines = [
        StintInline,
        BylineInline,
    ]


@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    def active_now(self, instance):
        active = instance.active()
        if len(active) == 1:
            text = str(active[0].contributor)
        else:
            text = str(len(active))
        url = (
            '/admin/contributors/stint/'
            f'?is_active=now&position__id__exact={instance.pk}'
        )
        return mark_safe(f'<a href={url}>{text}</a>')

    def total(self, instance):
        count = instance.stint_set.count()
        url = (
            '/admin/contributors/stint/'
            f'?position__id__exact={instance.pk}'
        )
        return mark_safe(f'<a href={url}>{count}</a>')

    def groups_list(self, instance):
        return ', '.join(str(group) for group in instance.groups.all())

    list_display = [
        'title',
        'total',
        'active_now',
        'groups_list',
    ]


class StintActiveFilter(admin.SimpleListFilter):
    title = _('active')
    parameter_name = 'is_active'

    def lookups(self, request, model_admin):
        """ what will be shown in the sidebar """
        return (
            ('now', _('active')),
            ('past', _('quit')),
            ('future', _('not started')),
            ('noend', _('no end date')),
        )

    def queryset(self, request, queryset):

        when = timezone.now().date()
        if self.value() == 'now':
            return queryset.active()

        if self.value() == 'past':
            return queryset.filter(end_date__lt=when)

        if self.value() == 'future':
            return queryset.filter(start_date__gt=when)

        if self.value() == 'noend':
            return queryset.filter(end_date=None)


@admin.register(Stint)
class StintAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.order_by('-end_date', '-start_date')

    list_per_page = 25
    list_filter = ['position', StintActiveFilter]
    form = modelform_factory(Stint, exclude=())

    list_display = (
        '__str__',
        'position',
        'start_date',
        'end_date',
    )

    list_editable = (
        'start_date',
        'end_date',
    )
