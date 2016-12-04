# -*- coding: utf-8 -*-
"""
Admin for printissues app
"""
from django.contrib import admin
from .models import PrintIssue, Issue
from .tasks import create_print_issue_pdf
from sorl.thumbnail.admin import AdminImageMixin
from sorl.thumbnail import get_thumbnail
# import autocomplete_light
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _
from django.contrib import messages


def create_pdf(modeladmin, request, queryset):
    messages.add_message(request, messages.INFO, 'started creating pdf')
    create_print_issue_pdf.delay()

def create_pdf_syncronous(modeladmin, request, queryset):
    create_print_issue_pdf()
    messages.add_message(request, messages.INFO, 'pdf created')

class ThumbAdmin:
    exclude = ()

    def thumbnail(self, instance, width=200, height=200):
        """ Show thumbnail of pdf frontpage """
        try:
            source = instance.get_thumbnail()
            thumb = get_thumbnail(source, '%sx%s' % (width, height))
            url = thumb.url
        except (AttributeError, FileNotFoundError):  # noqa
            url = '/static/admin/img/icon-no.gif'
        if instance.pdf:
            html = '<a href="{pdf}"><img src="{thumb}"></a>'.format(
                thumb=url,
                pdf=instance.pdf.url,
            )
        else:
            html = '<p>{}</p>'.format(_('PDF is not uploaded yet.'))
        return mark_safe(html)

    thumbnail.allow_tags = True

    def large_thumbnail(self, instance):
        return self.thumbnail(instance, width=800, height=800)


@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):

    list_per_page = 40
    date_hierarchy = 'publication_date'

    def pdf_thumb(self, pdf, width=250, height=100):
        try:
            source = pdf.get_thumbnail()
            thumb = get_thumbnail(
                source,
                '%sx%s' % (width, height),
                crop='top',
            )
            url = thumb.url
        except FileNotFoundError:  # noqa
            url = '/static/admin/img/icon-no.gif'
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

    list_display = (
        '__str__',
        'publication_date',
        'issue_type',
        'pdf_links',
    )
    list_editable = (
        'publication_date',
        'issue_type',
    )


@admin.register(PrintIssue)
class PrintIssueAdmin(AdminImageMixin, admin.ModelAdmin, ThumbAdmin):
    # date_hierarchy = 'publication_date'
    actions = [create_pdf, create_pdf_syncronous]
    actions_on_top = True
    actions_on_bottom = True
    save_on_top = True
    list_per_page = 40
    list_display = (
        # 'publication_date',
        'pages',
        'pdf',
        'thumbnail',
        'text',
        'issue'
    )
    search_fields = (
        'text',
        'pdf',
    )
    fieldsets = (
        ('', {'fields': (
            ('pdf', 'cover_page', 'pages', 'issue', ),
            ('large_thumbnail', 'text')
        ), }, ),
    )
    readonly_fields = (
        'large_thumbnail', 'text', 'pages',
    )
