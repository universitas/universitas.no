from bs4 import BeautifulSoup
from django.db import models
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _


class MarkupFieldMixin:
    def __init__(self, *args, **kwargs):
        kwargs.update(
            blank=True,
            default='',
        )
        super().__init__(*args, **kwargs)


class MarkupModelMixin:
    pass


class MarkupTextField(MarkupFieldMixin, models.TextField):
    description = 'subclass of Textfield containing markup.'


class MarkupCharField(MarkupFieldMixin, models.CharField):
    description = 'subclass of Charfield containing markup.'


class TextContent(models.Model, MarkupModelMixin):
    """ Abstract superclass for stories and related text elements. """

    class Meta:
        abstract = True

    bodytext_markup = MarkupTextField(
        help_text=_('Content with xtags markup.'),
        verbose_name=_('bodytext tagged text')
    )

    bodytext_html = models.TextField(
        blank=True,
        editable=False,
        default='',
        help_text=_('HTML tagged content'),
        verbose_name=_('bodytext html tagged')
    )

    def get_html(self):
        """ Returns text content as html. """
        return mark_safe(self.bodytext_html)

    def get_plaintext(self):
        """ Returns text content as plain text. """
        soup = BeautifulSoup(self.get_html(), 'html5lib')
        return soup.get_text()
