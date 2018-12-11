""" Admin for contributors app.  """
from django.contrib import admin, messages
from django.utils import timezone
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _

from utils.merge_model_objects import merge_instances

from .models import Contributor, Position, Stint


def merge_contributors(modeladmin, request, queryset):
    """Merge multiple contributors into one."""
    first, *rest = list(queryset)
    messages.add_message(
        request, messages.INFO,
        _('merging %(number)s instances into %(first)s') %
        {'number': len(rest), 'first': first}
    )
    merge_instances(first, *rest)


class StintInline(
    admin.TabularInline,
):
    model = Stint
    fields = [
        'position',
        'start_date',
        'end_date',
    ]
    autocomplete_fields = [
        'position',
    ]
    extra = 1


@admin.register(Contributor)
class ContributorAdmin(admin.ModelAdmin):
    actions = [merge_contributors]

    inlines = [
        StintInline,
        # BylineInline,
    ]
    list_display = [
        'display_name',
        'bylines_count',
        'verified',
        'status',
    ]
    list_editable = [
        'verified',
    ]
    readonly_fields = [
        'user',
    ]
    search_fields = [
        'display_name',
    ]
    autocomplete_fields = [
        'byline_photo',
    ]


@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'total',
        'active_now',
        'groups_list',
        'is_management',
    ]
    search_fields = [
        'title',
    ]
    list_editable = ['is_management']

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
    list_per_page = 25
    list_filter = ['position', StintActiveFilter]
    list_display = [
        '__str__',
        'position',
        'start_date',
        'end_date',
    ]
    list_editable = [
        'start_date',
        'end_date',
    ]
    autocomplete_fields = [
        'position',
        'contributor',
    ]

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.order_by('-end_date', '-start_date')
