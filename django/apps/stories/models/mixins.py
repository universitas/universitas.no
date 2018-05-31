import re
import unicodedata

from bs4 import BeautifulSoup

from apps.markup.models import Alias, BlockTag, InlineTag
from django.core.validators import ValidationError
from django.db import models
from django.template import Context, Template
from django.template.loader import get_template
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _

NON_PRINTING_CHARS = re.compile(
    '[{}]'.format(
        ''.join(
            c for c in (chr(o) for o in range(256))
            if unicodedata.category(c) == 'Cc' and c not in '\t\n'
        )
    )
)

MARKUP_TAGS = {
    'StoryImage': 'image',
    'Pullquote': 'quote',
    'Aside': 'box',
    'StoryVideo': 'video',
    'InlineHtml': 'html',
}


def remove_control_chars(s):
    return NON_PRINTING_CHARS.sub('', s)


class MarkupFieldMixin:
    def __init__(self, *args, **kwargs):
        kwargs.update(
            blank=True,
            default='',
        )
        super().__init__(*args, **kwargs)

    def clean(self, value, model_instance):
        value = super().clean(value, model_instance)
        value = remove_control_chars(value)
        value = self.clean_links(value, model_instance)
        soup = BeautifulSoup(value, 'html5lib')
        if value != soup.text:
            error_message = '{warning} {tags}'.format(
                warning=_('HTML tags found in text: '), tags=soup.find_all()
            )
            raise ValidationError(error_message)
        value = Alias.objects.replace(
            content=value, timing=Alias.TIMING_IMPORT
        )
        value = Alias.objects.replace(content=value, timing=Alias.TIMING_EXTRA)
        return value

    def clean_links(self, text, model_instance):
        """ Clean up links into markup format """
        from .links import InlineLink  # noqa
        if model_instance.parent_story.pk is None:
            # Cannot create links before story is saved.
            return text
        text = InlineLink.convert_html_links(text)
        text = InlineLink.clean_and_create_links(
            body=text, parent_story=model_instance.parent_story
        )
        return text


class MarkupTextField(MarkupFieldMixin, models.TextField):
    description = 'subclass of Textfield containing markup.'


class MarkupCharField(MarkupFieldMixin, models.CharField):
    description = 'subclass of Charfield containing markup.'


class MarkupModelMixin:
    """ adds the 'html' property to a Model
    Lets regular django models be louder!

    Regular field:
    >>> blogpost.title
    'hello world'

    Same field, but louder.
    >>> blogpost.html.title
    '<strong>HELLO WORLD!</strong>'
    """

    @property
    def html(self):
        return self._HTML(self)

    class _HTML(object):
        def __init__(self, parent):
            self.parent = parent

        def __getattr__(self, attr, *args):
            try:
                field = type(self.parent)._meta.get_field(attr)
            except models.fields.FieldDoesNotExist:
                pass
            else:
                if not issubclass(type(field), MarkupFieldMixin):
                    raise RuntimeError('only MarkupFields can be html')

            raw = getattr(self.parent, attr, *args)
            assert isinstance(raw, str), 'Only strings can be htmlized'
            return mark_safe(self.make_html(raw))

        def make_html(self, raw):
            result = []
            for line in raw.splitlines():
                # line = BlockTag.objects.make_html(line)
                line = InlineTag.objects.make_html(line)
                line = self.parent.parent_story.inline_links.markup_to_html(
                    line
                )
                result.append(line)
            return '\n'.join(result)


class TextContent(models.Model, MarkupModelMixin):
    """ Abstract superclass for stories and related text elements. """

    class Meta:
        abstract = True

    template_name = 'bodytext_element.html'

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

    def save(self, *args, **kwargs):
        if self.pk:
            old = self.__class__.objects.get(pk=self.pk)
            if old.bodytext_markup != self.bodytext_markup:
                self.bodytext_html = ''
        super().save(*args, **kwargs)

    def get_html(self):
        """ Returns text content as html. """
        if self.bodytext_markup and not self.bodytext_html:
            self.bodytext_html = self.make_html()
            self.save(update_fields=['bodytext_html'])
        return mark_safe(self.bodytext_html)

    def get_plaintext(self):
        """ Returns text content as plain text. """
        soup = BeautifulSoup(self.get_html(), 'html5lib')
        return soup.get_text()

    def make_html(self, body=None):
        """ Create html body text from markup """

        # TODO: Måten artikler blir rendret på er veldig rotete. Mest mulig bør
        # flyttes fra model til template.

        if body is None:
            body = self.html.bodytext_markup

        tag_template = (  # Used as django template to render inline stuff.
            '{{% load inline_elements %}}'
            '{{% inline_{classname} "\\1" %}}'
        )
        regex = '^@{markup_tag}: *([^#\n]*) *$'

        for classname, markup_tag in MARKUP_TAGS.items():
            find = regex.format(markup_tag=markup_tag)
            replace = tag_template.format(classname=classname.lower())
            body = re.sub(find, replace, body, flags=re.M)

        paragraphs = body.splitlines() + ['']
        sections, main_body = [], []

        for index, paragraph in enumerate(paragraphs):
            if not paragraph.startswith('{'):
                # Regular paragraph.
                paragraph = BlockTag.objects.make_html(paragraph)
                main_body.append(paragraph)
            else:  # Inline element.
                sections.append(main_body)
                paragraph = Template(paragraph).render(
                    Context({"story": self, "index": index})
                )
                sections.append(paragraph)
                main_body = []

        sections.append(main_body)

        blocks = []
        for section in sections:
            if isinstance(section, list):
                inline = False
                section = '\n'.join(section).strip()
            else:
                inline = True
            if section:
                blocks.append({'inline': inline, 'html': mark_safe(section)})

        t = get_template(self.template_name)
        html = t.render({"blocks": blocks})
        return html

    def insert_urls_in_links(self, text):
        """ Change markup references to urls. """
        text = self.parent_story.inline_links.insert_urls(text)
        return text

    def parse_markup(self):
        """ Use raw input tagged text to populate
        fields and create related objects """
        paragraphs = self.bodytext_markup.splitlines()
        self.bodytext_markup = ''
        target = self
        # Target is the model instance that will receive following line of
        # text.  It could be the main article, or some related element,
        # such as multi paragraph aside.
        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            # if paragraph == '':
            # skip empty paragraphs
            #     continue
            blocktag, paragraph = BlockTag.objects.match_or_create(paragraph)
            tag, text_content = blocktag.split(paragraph)
            if re.match(r'^\s*$', text_content):
                # no text_content, prune this line.
                continue
            function_name, target_field = blocktag.action.split(':')
            # The Blocktag model contains instructions for the
            # various kinds of block (paragraph) level tags
            # that are in use. Actions are "_block_append", "_block_new" and
            # "_block_drop".
            action = getattr(
                target, '_block_{func}'.format(func=function_name)
            )
            # do action on
            new_target = action(tag, text_content, target_field)
            # new target could be newly created object or a parent element.
            if new_target != target != self:
                # This story element is completed.
                target.save()
            target = new_target

        if target != self:
            # Cleanup
            target.save()

    def _block_append(self, tag, content, modelfield=None):
        """ Appends content(string) to a model field by string reference. """
        # default is to add to body text
        modelfield = modelfield or 'bodytext_markup'
        if modelfield != 'bodytext_markup':
            # only body text needs block tags.
            tag = ''
        try:
            new_content = '{old_content}\n{tag}{added_content}'.format(
                old_content=getattr(self, modelfield),
                tag=tag,
                added_content=content,
            ).strip()
            actual_field = self.__class__._meta.get_field(modelfield)
            if actual_field.max_length:
                new_content = new_content[:actual_field.max_length]
            setattr(self, modelfield, new_content)
            return self
        except (AttributeError):
            # No such field. Try the main story instead.
            return self.parent_story._block_append(tag, content, modelfield)
        except (AssertionError, ) as errormsg:
            msg = (
                'Tried to append text to field '
                '{class_name}.{field}\n{errormsg}'
            ).format(
                class_name=self.__class__.__name__,
                field=modelfield,
                errormsg=errormsg,
            )
            raise TypeError(msg)

    def _block_new(self, *args, **kwargs):
        """ Create new related story element. """
        # Send control up to parent story instance.
        return self.parent_story._block_new(*args, **kwargs)

    def _block_drop(self, *args, **kwargs):
        """ Returns self and ignores any arguments """
        return self
