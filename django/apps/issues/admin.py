""" Admin for printissues app """
import logging

# from sorl.thumbnail.admin import AdminImageMixin
from django.contrib import admin, messages
from django.contrib.staticfiles.storage import staticfiles_storage
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _

from sorl.thumbnail import get_thumbnail
from utils.sorladmin import AdminImageMixin

from .models import Issue, PrintIssue
from .tasks import create_print_issue_pdf

logger = logging.getLogger(__name__)


def create_pdf(modeladmin, request, queryset):
    messages.add_message(request, messages.INFO, 'started creating pdf')
    issue = queryset.first()
    create_print_issue_pdf.delay(issue.id, expiration_days=0)


class ThumbAdmin:
    exclude = ()

    def thumbnail(self, instance, width=200, height=200):
        """ Show thumbnail of pdf frontpage """
        try:
            thumb = instance.thumbnail()
            url = thumb.url
        except (AttributeError, FileNotFoundError):
            logger.exception('thumb error')
            url = staticfiles_storage.url('/admin/img/icon-no.svg')
        if instance.pdf:
            html = '<a href="{pdf}"><img src="{thumb}"></a>'.format(
                thumb=url,
                pdf=instance.pdf.url,
            )
        else:
            html = '<p>{}</p>'.format(_('PDF is not uploaded yet.'))
        return mark_safe(html)

    thumbnail.allow_tags = True  # typing: disable

    def large_thumbnail(self, instance):
        return self.thumbnail(instance, width=800, height=800)


@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    actions = [create_pdf]
    actions_on_top = True
    actions_on_bottom = True
    list_per_page = 40
    date_hierarchy = 'publication_date'
    list_display = [
        '__str__',
        'publication_date',
        'issue_type',
        'pdf_links',
    ]
    list_editable = [
        'publication_date',
        'issue_type',
    ]
    search_fields = [
        'name',
    ]

    def pdf_thumb(self, pdf, width=250, height=100):
        try:
            thumb = get_thumbnail(
                pdf.get_cover_page(),
                '%sx%s' % (width, height),
                crop='top',
            )
            url = thumb.url
        except FileNotFoundError:  # noqa
            url = '/static/admin/img/icon-no.svg'
        return url

    def pdf_links(self, instance):
        html = ''
        a_template = '<a href="{url}"><img src="{thumb}"><p>{filename}</p></a>'
        for pdf in instance.pdfs.all():
            html += a_template.format(
                url=pdf.get_edit_url(),
                filename=pdf.pdf.name,
                thumb=self.pdf_thumb(pdf),
            )

        if not html:
            html = "Nei"

        return mark_safe(html)


@admin.register(PrintIssue)
class PrintIssueAdmin(AdminImageMixin, admin.ModelAdmin, ThumbAdmin):
    save_on_top = True
    list_per_page = 40
    list_display = [
        'pages',
        'pdf',
        'thumbnail',
        'extract',
        'issue',
    ]
    search_fields = [
        'text',
        'pdf',
    ]
    readonly_fields = [
        'large_thumbnail',
        'text',
        'extract',
        'pages',
    ]
    autocomplete_fields = [
        'issue',
    ]
    fieldsets = [[
        '', {
            'fields': (
                ('issue', ),
                ('pdf', 'cover_page', 'pages'),
                ('large_thumbnail', 'extract'),
            )
        }
    ]]
