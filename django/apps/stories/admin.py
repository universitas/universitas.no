""" Admin for stories app.  """

from apps.frontpage.models import FrontpageStory
from apps.photo.admin import ThumbAdmin
from autocomplete_light.forms import modelform_factory
from django.contrib import admin
from django.db import models
from django.forms import Textarea, TextInput
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _

from .models import (
    Aside, Byline, InlineHtml, InlineLink, Pullquote, Section, Story,
    StoryImage, StoryType, StoryVideo
)

# from django.utils.html import format_html_join
# from apps.photo.models import ImageFile
# from sorl.thumbnail.admin import AdminImageMixin


class SmallTextArea:
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 5, 'cols': 30})},
        models.CharField: {'widget': Textarea(attrs={'rows': 5, 'cols': 30})},
    }


class BylineInline(admin.TabularInline):
    form = modelform_factory(Byline, exclude=())
    model = Byline
    fields = (
        'ordering',
        'credit',
        'contributor',
        'title',
    )
    extra = 0
    max_num = 20
    formfield_overrides = {
        models.CharField: {
            'widget': TextInput(attrs={'style': 'width:400px;'})
        },
    }


class FrontpageStoryInline(SmallTextArea, admin.TabularInline, ThumbAdmin):
    form = modelform_factory(FrontpageStory, exclude=())
    model = FrontpageStory
    fields = (
        'headline',
        'kicker',
        'lede',
        'imagefile',
        'full_thumb',
    ),
    readonly_fields = ('full_thumb', )
    extra = 0


class AsideInline(
    admin.TabularInline,
):
    model = Aside
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 6, 'cols': 80})},
    }
    extra = 0


class HtmlInline(
    admin.TabularInline,
):
    model = InlineHtml
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 6, 'cols': 80})},
    }
    extra = 0


class PullquoteInline(
    admin.TabularInline,
):
    model = Pullquote
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 2, 'cols': 80})},
    }
    extra = 0


class LinkInline(admin.TabularInline):
    form = modelform_factory(InlineLink, exclude=())
    model = InlineLink
    fk_name = 'parent_story'
    extra = 0


class VideoInline(
    admin.TabularInline,
):
    model = StoryVideo
    formfield_overrides = {
        models.CharField: {'widget': Textarea(attrs={'rows': 5, 'cols': 30})},
    }
    fields = [
        'top',
        'index',
        'caption',
        'creditline',
        'size',
        'video_host',
        'host_video_id',
    ]
    extra = 0


class ImageInline(
    admin.TabularInline,
    ThumbAdmin,
):
    form = modelform_factory(StoryImage, exclude=())
    formfield_overrides = {
        models.CharField: {'widget': Textarea(attrs={'rows': 5, 'cols': 30})},
    }
    model = StoryImage
    fields = [
        'top',
        'index',
        'caption',
        'creditline',
        'size',
        'aspect_ratio',
        'imagefile',
        'full_thumb',
    ]
    readonly_fields = ('full_thumb', )
    extra = 0


class StoryTypeInline(admin.TabularInline):
    model = StoryType
    extra = 1


def make_frontpage_story(modeladmin, request, queryset):
    make_frontpage_story.short_description = _('make frontpage story')
    for story in queryset:
        FrontpageStory.objects.autocreate(story=story)


class PublicationStatusFilter(admin.SimpleListFilter):
    title = _('status')
    parameter_name = 'status'

    def lookups(self, request, model_admin):
        """ what will be shown in the sidebar """
        return (
            ('web', _('website')),
            ('unpub', _('unpublished')),
            ('wip', _('work in progress')),
            ('desk', _('newsdesk')),
        )

    def queryset(self, request, queryset):

        if self.value() == 'wip':
            return queryset.filter(
                publication_status__in=[
                    Story.STATUS_DRAFT,
                    Story.STATUS_JOURNALIST,
                    Story.STATUS_SUBEDITOR,
                    Story.STATUS_EDITOR,
                ]
            )

        if self.value() == 'desk':
            return queryset.filter(
                publication_status__in=[
                    Story.STATUS_TO_DESK,
                    Story.STATUS_AT_DESK,
                ]
            )

        if self.value() == 'web':
            return queryset.filter(
                publication_status__in=[
                    Story.STATUS_PUBLISHED,
                    Story.STATUS_FROM_DESK,
                    Story.STATUS_NOINDEX,
                ]
            )

        if self.value() == 'unpub':
            return queryset.filter(
                publication_status__in=[
                    Story.STATUS_PRIVATE,
                    Story.STATUS_TEMPLATE,
                    Story.STATUS_ERROR,
                ]
            )


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    def get_title(self, instance):
        text = ''
        if instance.kicker:
            text += f'<em>{instance.kicker}</em></br>'
        if instance.title:
            text += f'<strong>{instance.title}</strong>'
        elif instance.working_title:
            text += f'[ {instance.working_title} ]'
        else:
            text += '---------'
        return mark_safe(text)

    get_title.short_description = _('title')  # type: ignore

    actions = [
        make_frontpage_story,
    ]
    date_hierarchy = 'publication_date'
    actions_on_top = True
    actions_on_bottom = True
    save_on_top = True
    list_per_page = 25
    list_filter = [PublicationStatusFilter, 'language', 'publication_status']
    list_display = [
        'get_title',
        'lede',
        'publication_status',
        'modified',
        'hot_count',
        'hit_count',
        'language',
        'story_type',
        'publication_date',
    ]

    # list_editable = [ 'publication_status', ]

    readonly_fields = [
        'legacy_html_source', 'legacy_prodsys_source', 'get_html'
    ]

    formfield_overrides = {
        models.CharField: {'widget': Textarea(attrs={'rows': 2, 'cols': 30})},
        models.TextField: {'widget': Textarea(attrs={'rows': 20, 'cols': 60})},
    }

    fieldsets = (
        (
            'header', {
                'fields': (
                    (
                        'title',
                        'kicker',
                        'theme_word',
                        'language',
                    ),
                    (
                        'story_type',
                        'publication_date',
                        'publication_status',
                        'comment_field',
                    ),
                ),
            }
        ),
        (
            'content', {
                'classes': ('collapsible', ),
                'fields': ((
                    'lede',
                    'bodytext_markup',
                ), ),
            }
        ),
        ('preview', {
            'classes': ('collapse', ),
            'fields': (('get_html'), ),
        }),
        (
            'source', {
                'classes': ('collapse', ),
                'fields': ((
                    'legacy_html_source',
                    'legacy_prodsys_source',
                ), ),
            }
        ),
    )

    inlines = [
        BylineInline,
        FrontpageStoryInline,
        ImageInline,
        VideoInline,
        PullquoteInline,
        AsideInline,
        LinkInline,
        HtmlInline,
    ]

    search_fields = (
        'title',
        'lede',
        'bylines_html',
        # 'story_type__name',
        # 'bylines',
    )

    def display_bylines(self, instance):
        return mark_safe(instance.bylines_html) or " -- "

    display_bylines.short_description = 'Bylines'  # type: ignore
    display_bylines.allow_tags = True  # type: ignore


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'title',
    )

    list_editable = ('title', )

    inlines = (StoryTypeInline, )


@admin.register(StoryType)
class StoryTypeAdmin(admin.ModelAdmin):
    form = modelform_factory(StoryType, exclude=[])
    list_display = (
        'id',
        'name',
        'section',
        'prodsys_mappe',
    )

    list_editable = (
        'name',
        'section',
    )


@admin.register(Byline)
class BylineAdmin(admin.ModelAdmin):
    form = modelform_factory(Byline, exclude=())
    list_display = (
        'id',
        'story',
        'contributor',
        'credit',
        'title',
    )
    list_editable = (
        'credit',
        'title',
    )


def find_linked_story(modeladmin, request, queryset):
    find_linked_story.short_description = _('find linked stories')
    for link in queryset:
        if link.find_linked_story():
            link.save()


def check_link_status(modeladmin, request, queryset):
    find_linked_story.short_description = _('find linked stories')
    for link in queryset:
        link.check_link(save_if_changed=True)


@admin.register(InlineLink)
class LinkAdmin(admin.ModelAdmin):
    form = modelform_factory(InlineLink, exclude=())
    actions_on_bottom = actions_on_top = True
    actions = [find_linked_story, check_link_status]
    list_display = (
        'id',
        'parent_story',
        'number',
        'alt_text',
        'get_html',
        'get_tag',
        'link',
        # 'linked_story',
        'status_code',
    )
    list_editable = (
        'alt_text',
        # 'href',
    )
    list_filter = ('status_code', )
