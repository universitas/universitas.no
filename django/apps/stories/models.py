# -*- coding: utf-8 -*-
""" Content in the publication. """

# Python standard library
import re
import difflib
import json
import logging
import unicodedata

# Django core
from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from django.utils import timezone
from django.db import models
from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist
from django.core.validators import URLValidator, ValidationError
from django.utils.safestring import mark_safe
from django.core.urlresolvers import reverse
from django.template import Context, Template
from django.template.loader import get_template
# from django.contrib.postgres.fields import JSONField

# Installed apps
from django_extensions.db.fields import AutoSlugField

from bs4 import BeautifulSoup
from diff_match_patch import diff_match_patch
from requests import request
from requests.exceptions import Timeout, MissingSchema, ConnectionError
from model_utils.models import TimeStampedModel
from utils.model_mixins import Edit_url_mixin
from slugify import Slugify


# Project apps
from apps.contributors.models import Contributor
from apps.markup.models import BlockTag, InlineTag, Alias
from apps.photo.models import ImageFile
from apps.frontpage.models import FrontpageStory
# from apps.issues.models import PrintIssue

from .status_codes import HTTP_STATUS_CODES
from .bylines import clean_up_bylines

# Hardcoded tags for special content
PULLQUOTE_TAG = '@quote:'
ASIDE_TAG = '@box:'
IMAGE_TAG = '@image:'
VIDEO_TAG = '@video:'
INLINE_HTML_TAG = '@html:'
NON_PRINTING_CHARS = re.compile('[{}]'.format(''.join(
    c for c in (chr(o) for o in range(256))
    if unicodedata.category(c) == 'Cc' and
    c not in '\t\n'
)))

slugify = Slugify(max_length=50, to_lower=True)
logger = logging.getLogger(__name__)


def remove_control_chars(s):
    return NON_PRINTING_CHARS.sub('', s)


class MarkupFieldMixin(object):

    def __init__(self, *args, **kwargs):
        kwargs.update(
            blank=True,
            default='',
        )
        super().__init__(*args, **kwargs)

    def clean(self, value, model_instance):
        value = super().clean(value, model_instance)
        value = remove_control_chars(value)
        value = re.sub(r'\r\n', '\n', value)
        value = self.clean_links(value, model_instance)
        soup = BeautifulSoup(value, 'html5lib')
        if value != soup.text:
            error_message = '{warning} {tags}'.format(
                warning=_('HTML tags found in text: '), tags=soup.find_all())
            raise ValidationError(error_message)
        value = Alias.objects.replace(
            content=value, timing=Alias.TIMING_IMPORT)
        value = Alias.objects.replace(content=value, timing=Alias.TIMING_EXTRA)
        return value

    def clean_links(self, text, model_instance):
        """ Clean up links into markup format """
        text = InlineLink.convert_html_links(text)
        text = InlineLink.clean_and_create_links(
            body=text,
            parent_story=model_instance.parent_story
        )
        return text


class MarkupTextField(MarkupFieldMixin, models.TextField):
    description = 'subclass of Textfield containing markup.'


class MarkupCharField(MarkupFieldMixin, models.CharField, ):
    description = 'subclass of Charfield containing markup.'


class MarkupModelMixin(object):

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
                line = self.parent.links().markup_to_html(line)
                result.append(line)
            return '\n'.join(result)


class Section(models.Model):

    """ A Section in the publication containing one kind of content. """

    class Meta:
        verbose_name = _('Section')
        verbose_name_plural = _('Sections')

    title = models.CharField(
        unique=True,
        max_length=50,
        help_text=_('Section title'),
        verbose_name=_('section title'),
    )

    slug = AutoSlugField(
        _('slug'),
        populate_from=('title',),
        default='section-slug',
        max_length=50,
        overwrite=True,
        slugify_function=slugify,
    )

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        url = reverse(
            viewname='section',
            kwargs={
                'section': self.slug,
            },)
        return url


class StoryType(models.Model):

    """ A type of story in the publication. """

    name = models.CharField(unique=True, max_length=50)
    section = models.ForeignKey(Section)
    template = models.ForeignKey('Story', blank=True, null=True)
    prodsys_mappe = models.CharField(
        blank=True, null=True,
        max_length=20)

    slug = AutoSlugField(
        _('slug'),
        default='storytype-slug',
        populate_from=('name',),
        max_length=50,
        overwrite=True,
        slugify_function=slugify,
    )

    class Meta:
        verbose_name = _('StoryType')
        verbose_name_plural = _('StoryTypes')

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        url = reverse(
            viewname='storytype',
            kwargs={
                'storytype': self.slug,
                'section': self.section.slug,
            },)
        return url


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

    def pullquotes(self):
        return self.parent_story.storyelement_set.pullquotes()

    def asides(self):
        return self.parent_story.storyelement_set.asides()

    def images(self):
        return self.parent_story.storyelement_set.images()

    def videos(self):
        return self.parent_story.storyelement_set.videos()

    def inline_html_blocks(self):
        return self.parent_story.storyelement_set.inline_html_blocks()

    def links(self):
        return self.parent_story.inline_links

    def get_html(self):
        """ Returns text content as html. """
        if self.bodytext_markup and not self.bodytext_html:
            self.bodytext_html = self.make_html()
            self.save(update_fields=['bodytext_html'])
            return mark_safe(self.bodytext_html)
        else:
            return mark_safe(self.make_html())

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
        regex = '^{markup_tag} *([^#\n]*) *$'

        for cls in (StoryImage, Pullquote, Aside, StoryVideo, InlineHtml):
            classname = cls.__name__.lower().replace(' ', '')
            find = regex.format(markup_tag=cls.markup_tag)
            replace = tag_template.format(classname=classname)
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
                    Context({"story": self, "index": index, }))
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
                blocks.append({
                    'inline': inline,
                    'html': mark_safe(section)
                })

        t = get_template(self.template_name)
        html = t.render(Context({"blocks": blocks}))
        return html

    def insert_urls_in_links(self, text):
        """ Change markup references to urls. """
        text = self.links().insert_urls(text)
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
                target, '_block_{func}'.format(func=function_name))
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
            raise
            # No such field. Try the main story instead.
            return self.parent_story._block_append(tag, content, modelfield)
        except (AssertionError,) as errormsg:
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


class StoryQuerySet(models.QuerySet):

    def published(self):
        now = timezone.now()
        return self.filter(
            publication_status__in=[
                Story.STATUS_PUBLISHED,
                Story.STATUS_NOINDEX,
            ]
        ).filter(publication_date__lt=now)

    def is_on_frontpage(self, frontpage):
        return self.filter(frontpagestory__placements=frontpage)


class PublishedStoryManager(models.Manager):

    def get_queryset(self):
        return StoryQuerySet(self.model, using=self._db)

    def published(self):
        return self.get_queryset().published()

    def is_on_frontpage(self, frontpage):
        return self.get_queryset().is_on_frontpage(frontpage)

    def populate_frontpage(self, **kwargs):
        """ create some random frontpage stories """
        if not kwargs:
            this_year = timezone.now().year
            kwargs = {'publication_date__year': this_year}
        new_stories = self.filter(**kwargs).order_by('publication_date')
        for story in new_stories:
            story.frontpagestory_set.all().delete()
            story.save(new=True)

    def devalue_hotness(self, factor=0.99):
        """ Devalue hot count for all stories. Run as a scheduled task. """
        hot_stories = self.exclude(hot_count__lt=1)
        hot_stories.update(hot_count=(models.F('hot_count') - 1) * factor)


class Story(TextContent, TimeStampedModel, Edit_url_mixin):

    """ An article or story in the newspaper. """

    class Meta:
        verbose_name = _('Story')
        verbose_name_plural = _('Stories')

    objects = PublishedStoryManager()
    template_name = 'bodytext.html'

    STATUS_DRAFT = 0
    STATUS_EDITOR = 5
    STATUS_READY = 9
    STATUS_PUBLISHED = 10
    STATUS_NOINDEX = 11
    STATUS_PRIVATE = 15
    STATUS_TEMPLATE = 100
    STATUS_ERROR = 500
    STATUS_CHOICES = [
        (STATUS_DRAFT, _('Draft')),
        (STATUS_EDITOR, _('Ready to edit')),
        (STATUS_READY, _('Ready to publish on website')),
        (STATUS_PUBLISHED, _('Published on website')),
        (STATUS_NOINDEX, _('Published, but hidden from search engines')),
        (STATUS_PRIVATE, _('Will not be published')),
        (STATUS_TEMPLATE, _('Used as template for new articles')),
        (STATUS_ERROR, _('Technical error')),
    ]

    prodsak_id = models.PositiveIntegerField(
        blank=True, null=True, editable=False,
        help_text=_('primary id in the legacy prodsys database.'),
        verbose_name=_('prodsak id')
    )
    language = models.CharField(
        max_length=10,
        help_text=_('language'),
        verbose_name=_('language'),
        choices=settings.LANGUAGES,
        default=settings.LANGUAGES[0][0],
    )
    title = MarkupCharField(
        max_length=1000,
        help_text=_('main headline or title'),
        verbose_name=_('title'),
    )
    slug = AutoSlugField(
        _('slug'),
        default='story-slug',
        allow_duplicates=True, populate_from=('title',),
        max_length=50,
        overwrite=True,
        slugify_function=slugify,
    )
    kicker = MarkupCharField(
        max_length=1000,
        blank=True,
        help_text=_(
            'secondary headline, usually displayed above main headline'),
        verbose_name=_('kicker'),
    )
    lede = MarkupTextField(
        blank=True,
        help_text=_('brief introduction or summary of the story'),
        verbose_name=_('lede'),
    )
    comment = models.TextField(
        default='', blank=True,
        help_text=_('for internal use only'),
        verbose_name=_('comment'),
    )
    theme_word = MarkupCharField(
        max_length=100,
        blank=True,
        help_text=_('theme, topic, main keyword'),
        verbose_name=_('theme word'),
    )
    bylines = models.ManyToManyField(
        Contributor, through='Byline',
        help_text=_('the people who created this content.'),
        verbose_name=_('bylines'),
    )
    story_type = models.ForeignKey(
        StoryType,
        help_text=_('the type of story.'),
        verbose_name=_('article type'),
    )
    publication_date = models.DateTimeField(
        null=True, blank=True,
        help_text=_('when this story will be published on the web.'),
        verbose_name=_('publication date'),
    )
    publication_status = models.IntegerField(
        default=STATUS_DRAFT, choices=STATUS_CHOICES,
        help_text=_('publication status.'),
        verbose_name=_('status'),
    )
    issue = models.ForeignKey(
        'issues.PrintIssue', blank=True, null=True,
        help_text=_('which issue this story was printed in.'),
        verbose_name=_('issue'),
    )
    page = models.IntegerField(
        blank=True, null=True,
        help_text=_('which page the story was printed on.'),
        verbose_name=_('page'),
    )
    hit_count = models.PositiveIntegerField(
        default=0,
        editable=False,
        help_text=_('how many time the article has been viewed.'),
        verbose_name=_('total page views')
    )
    hot_count = models.PositiveIntegerField(
        default=1000,  # All stories are hot when first published!
        editable=False,
        help_text=_('calculated value representing recent page views.'),
        verbose_name=_('recent page views')
    )
    bylines_html = models.TextField(
        default='', editable=False,
        verbose_name=_('all bylines as html.'),
    )
    legacy_html_source = models.TextField(
        blank=True, null=True, editable=False,
        help_text=_('From old web page. For reference only.'),
        verbose_name=_('Imported html source.'),
    )
    legacy_prodsys_source = models.TextField(
        blank=True, null=True, editable=False,
        help_text=_('From prodsys. For reference only.'),
        verbose_name=_('Imported xtagged source.'),
    )

    def __str__(self):
        if self.publication_date:
            return '{:%Y-%m-%d}: {}'.format(self.publication_date, self.title)
        else:
            return '{}'.format(self.title,)

    def save(self, *args, **kwargs):
        new = kwargs.pop('new', (self.pk is None))

        super().save(*args, **kwargs)

        if new:
            # make inline elements
            self.bodytext_markup = self.place_all_inline_elements()
            super().save(update_fields=['bodytext_markup'])

            if self.frontpagestory_set.count() == 0:
                # make random frontpage story
                FrontpageStory.objects.autocreate(story=self)

    @property
    def parent_story(self):
        # for polymorphism with related content.
        return self

    @property
    def disqus_enabled(self):
        # Is Disqus available here?
        return True

    @property
    def priority(self):
        """ Calculate a number between 1 and 12 to determine initial
        front page priority. """
        # TODO: Placeholder priority for story.
        pri = 0
        pri += 1 * bool(self.lede)
        pri += 2 * bool(self.main_image())
        pri += 1 * bool(self.kicker)
        pri += 3 * ('@tit' in self.bodytext_markup)
        pri += len(self.bodytext_markup) // 1000
        return min(12, pri)

    def visit_page(self, request):
        """ Check if visit looks like a human and update hit count """
        if not self.publication_status == self.STATUS_PUBLISHED:
            # Only count hits on published pages.
            return False
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
        if not user_agent:
            # Visitor is not using a web browser.
            return False

        bots = ['bot', 'spider', 'yahoo', 'crawler']
        for bot in bots:
            if bot in user_agent:
                # Search engine web crawler.
                return False

        cache_key = '{}{}'.format(
            request.META.get('REMOTE_ADDR', ''),  # visitor ip
            self.pk,  # story primary key
        )
        if cache.get(cache_key):
            # same ip address has visited page recently
            return False

        cache.set(cache_key, 1, 600)  # time to live in seconds is 600

        self.hit_count = models.F('hit_count') + 1
        self.hot_count = models.F('hot_count') + 100
        self.save(update_fields=['hit_count', 'hot_count'])
        return True

    def get_bylines_as_html(self):
        """ create html table of bylines in db for search and admin display """
        # translation.activate(settings.LANGUAGE_CODE)
        all_bylines = ['<table class="admin-bylines">']
        for bl in self.byline_set.select_related('contributor'):
            all_bylines.append(
                '<tr><td>{}</td><td>{}</td><td>{}</td></tr>'.format(
                    bl.get_credit_display(),
                    bl.contributor.display_name,
                    bl.title,
                )
            )
        # translation.deactivate()
        all_bylines.append('</table>')
        return '\n'.join(all_bylines)

    def get_bylines(self):
        # with translation.override()
        # translation.activate(settings.LANGUAGE_CODE)
        authors = []
        for bl in self.byline_set.select_related('contributor'):
            authors.append(
                '{name}{title}'.format(
                    name=bl.contributor.display_name,
                    title=', {}'.format(bl.title) if bl.title else '',
                    # credit=bl.get_credit_display(),
                )
            )
        # translation.deactivate()
        return ', '.join(authors)

    def image_count(self):
        """ Number of story images related to the story """
        return len(self.images())

    def main_image(self):
        """ Get the top image if there is any. """
        top_image = self.images().order_by('-top', 'index').first()
        if top_image:
            return top_image.child

    def thumb(self):
        image = self.main_image()
        if image:
            return image.imagefile.thumb()

    @property
    def section(self):
        """ Shortcut to related Section """
        return self.story_type.section

    def clear_html(self):
        """ clears html after child is changed """
        if self.bodytext_html != '':
            Aside.objects.filter(
                parent_story__pk=self.pk).update(
                bodytext_html='')
            Pullquote.objects.filter(
                parent_story__pk=self.pk).update(
                bodytext_html='')
            self.bodytext_html = ''
            self.save(update_fields=['bodytext_html'])

    def get_absolute_url(self):
        url = reverse(
            viewname='article',
            kwargs={
                'story_id': str(self.id),
                'section': self.section.slug,
                'slug': self.slug,
            },)
        return url

    def get_shortlink(self):
        url = reverse(
            viewname='article_short',
            kwargs={
                'story_id': str(self.id),
            },)
        return 'http://universitas.no' + url

    def children_modified(self):
        """ check if any related objects have been
        modified after self was last saved. """
        changed_elements = self.storyelement_set.filter(
            modified__gt=self.modified)
        changed_links = self.links().filter(modified__gt=self.modified)
        return bool(changed_elements or changed_links)

    def clean(self):
        """ Clean user input and populate fields """
        if not self.title and '@headline:' not in self.bodytext_markup:
            self.bodytext_markup = self.bodytext_markup.replace(
                '@tit:',
                '@headline:',
                1)
        self.parse_markup()
        # self.bodytext_markup = self.reindex_inlines()
        # TODO: Fix redindeksering av placeholders for video og bilder.
        self.bylines_html = self.get_bylines_as_html()
        if (not self.publication_date and
                self.publication_status == self.STATUS_PUBLISHED):
            self.publication_date = timezone.now()
        self.bodytext_markup = Alias.objects.replace(
            content=self.bodytext_markup,
            timing=Alias.TIMING_CLEAN)
        super().clean()

    def _block_new(self, tag, content, element):
        """ Add a story element to the main story """
        if element == "byline":
            bylines_raw = clean_up_bylines(content)
            for raw_byline in bylines_raw.splitlines():
                Byline.create(
                    story=self,
                    full_byline=raw_byline,
                    initials='',
                    # TODO: legg inn initialer i bylines som er importert fra
                    # prodsys.
                )
            return self
        elif element == "aside":
            new_element = Aside(parent_story=self, )
        elif element == "pullquote":
            new_element = Pullquote(parent_story=self, )
        return new_element._block_append(tag, content)

    def place_all_inline_elements(self):
        """ Insert inline elements into the
        bodytext according to heuristics. """

        def _main(self=self, body=self.bodytext_markup):

            # remove tags:
            for cls in Aside, StoryImage, Pullquote, StoryVideo, InlineHtml:
                find = r'^{tag}.*$'.format(tag=cls.markup_tag)
                body = re.sub(find, '', body, flags=re.M)

            # insert asides
            asides = self.asides().inline()
            body = top_right(asides, body)

            # insert images
            images = self.images().inline()
            body = big_on_top_search_for_rest(images, body)

            # insert videos
            videos = self.videos().inline()
            body = fifty_fifty(videos, body)

            # insert pullquotes
            pullquotes = self.pullquotes().inline()
            body = fuzzy_search(pullquotes, body)

            return body

        def fifty_fifty(queryset, body):
            """Half of elements in header, rest spread evenly through body"""
            # TODO: Bedre autoplassering av foto.
            addlines = []
            for item in queryset:
                flags = ''
                line = '{tag} {flags} {index}'.format(
                    tag=item.child.markup_tag,
                    flags=flags,
                    index=item.index,
                )
                addlines.append(line)

            body = '\n'.join(addlines + [body.strip()])
            return body

        def big_on_top_search_for_rest(queryset, body):
            for item in queryset:
                if item.child.size < 2:
                    item.top = True
                    item.save()

            return fuzzy_search(queryset.inline(), body, flags='>')

        def top_right(queryset, body, flags='>'):
            """ All elements at top, pulled right """
            addlines = []

            for item in queryset:
                line = '{tag} {flags} {index}'.format(
                    tag=item.child.markup_tag,
                    flags=flags,
                    index=item.index,
                )
                addlines.append(line)

            body = '\n'.join(addlines + [body.strip()])
            return body

        def fuzzy_search(queryset, body, flags=''):
            """ Place elements according to fuzzy text search. """
            diff = diff_match_patch(
            )   # Google's diff-match-patch library for fuzzy matching
            # default is 1000 characters match distance
            diff.Match_Distance = 5000
            # default is 0.5 ; 1.0 matches everything, 0.0 matches only perfect
            # hits.
            diff.Match_Threshold = 0.25

            def _find_in_text(needle, haystack):
                # strip whitespace and non-word characters. Converts to
                # lowercase.
                needle = re.sub(r'\W', '', needle).lower()
                haystack = re.sub(r'\W', '', haystack).lower()
                value = diff.match_main(haystack, needle, 0)  # -1 is no match
                return value is not -1

            paragraphs = body.splitlines()
            items = [item.child for item in queryset]

            for item in items:
                needle = item.needle()
                if not needle:
                    continue

                if item.index is None:
                    item.index = 0
                    item.save()  # reset index

                line = '{tag} {flags} {index}'.format(
                    tag=item.markup_tag,
                    flags=flags,
                    index=item.index
                )
                new_paragraphs = []
                for paragraph in paragraphs:
                    if needle and _find_in_text(needle, paragraph):
                        # found an acceptable match
                        new_paragraphs.append(line)
                        needle = None
                    new_paragraphs.append(paragraph)
                paragraphs = new_paragraphs

                if needle:
                    # place on top if no match is found.
                    paragraphs = [line] + paragraphs

            body = '\n'.join(paragraphs)
            # logger.debug(body)
            return body

        return _main()

    def find_inline_placeholders(self, element_class, body):
        """ Find placeholder markup for images,
        pullquotes and other story elements. """
        regex = r'^{tag}\s*([^#\n]*).*$'.format(tag=element_class.markup_tag)
        # TODO: Placeholder flags ( <, > ) are magic constants, and should be
        # moved somewhere smart.
        FLAGS = ['<', '>']
        matches = re.finditer(regex, body, flags=re.M)
        placeholders = []
        for match in matches:
            elements = re.split(r'[\s,]+', match.group(1))
            placeholders.append(
                {
                    'elements': elements,  # for bugtesting
                    'line': match.group(0),  # full match
                    'flags': [item for item in elements if item in FLAGS],
                    'indexes': [
                        int(index) for index in elements if index.isdigit()
                    ],
                }
            )
        return placeholders

    def reindex_inlines(self, element_classes=None, body=None):
        """
        Change placeholders in bodytext markup.
        Updates indexes in related elements to match.
        Remove orphan placeholders.
        """
        INDEX_NOT_FOUND = _('No such element. Valid indexes: ')
        body = body or self.bodytext_markup
        element_classes = element_classes or [
            Aside,
            StoryImage,
            StoryVideo,
            Pullquote,
            InlineHtml,
        ]

        for element_class in element_classes:

            elements = {}
            top_index = 0
            body_changed = False
            elements_changed = False

            subclass = element_class.__name__.lower()
            placeholders = self.find_inline_placeholders(element_class, body)
            queryset = self.storyelement_set.filter(
                _subclass=subclass,
                top=False)
            indexes = list(queryset.values_list('index', flat=True))
            for placeholder in placeholders:
                replace = []
                seen_indexes = set()
                for index in placeholder['indexes']:
                    if index in seen_indexes:
                        continue
                    seen_indexes.add(index)
                    for element in queryset.filter(index=index):
                        if element.pk in elements:
                            this_index = elements[element.pk].index
                        else:
                            elements[element.pk] = element
                            top_index += 1
                            this_index = top_index
                            if (element.index,
                                element.top) != (this_index,
                                                 False):
                                elements_changed = True
                                element.index = this_index
                                element.top = False
                        if this_index not in replace:
                            replace.append(this_index)
                        else:
                            pass
                if replace:
                    replace = placeholder['flags'] + replace
                else:
                    replace = placeholder['elements'] + \
                        ['#', INDEX_NOT_FOUND] + indexes or ['None']
                placeholder['replace'] = element_class.markup_tag + \
                    ' '.join(str(r) for r in replace)

                if placeholder['line'] != placeholder['replace']:
                    body_changed = True

                # logger.warn('\nflags: {flags}\nindexes: {indexes}\n {line} ->
                # {replace}'.format(**placeholder)))

            if elements_changed:
                for element in elements.values():
                    element.save()

            if body_changed:
                for placeholder in placeholders:
                    regex = '^{line}$'.format(line=placeholder['line'])
                    old_line = re.compile(regex, flags=re.M)
                    new_line = '#@##@#' + placeholder['replace']
                    body = old_line.sub(new_line, body, count=1)  # change
                body = re.sub('#@##@#', '', body)

        self.bodytext_markup = body
        return body


class ElementQuerySet(models.QuerySet):

    def top(self):
        """ Elements that are placed at the start of the parent article """
        return self.published().filter(top=True)

    def inline(self):
        """ Elements that are placed inside the story """
        return self.published().filter(top=False)

    def published(self):
        return self.filter(index__isnull=False)

    def unpublished(self):
        return self.filter(index__isnull=True)

    def images(self):
        return self.filter(_subclass='storyimage')

    def videos(self):
        return self.filter(_subclass='storyvideo')

    def pullquotes(self):
        return self.filter(_subclass='pullquote')

    def asides(self):
        return self.filter(_subclass='aside')

    def inline_html_blocks(self):
        return self.filter(_subclass='inlinehtml')


class ElementManager(models.Manager):

    qs_methods = [attr for attr in dir(ElementQuerySet) if not
                  attr.startswith('_')]

    def get_queryset(self):
        return ElementQuerySet(self.model, using=self._db)

    def __getattr__(self, attr):
        """ Checks the queryset class for missing methods. """
        if attr in self.qs_methods:
            return getattr(self.get_queryset(), attr)
        return self.__getattribute__(attr)


class RemembersSubClass(models.Model):

    """ Mixin for storyelements. Saves their class name in a field. """

    _subclass = models.CharField(
        editable=False,
        max_length=200,
    )

    class Meta:
        abstract = True

    @property
    def child(self):
        return getattr(self, self._subclass)

    def save(self, *args, **kwargs):
        if self.pk is None:
            subclass = self.__class__
            # Save name of the subclass
            self._subclass = subclass.__name__.lower()

        super().save(*args, **kwargs)


class StoryElement(TimeStampedModel, RemembersSubClass):

    """ Models that are placed somewhere inside an article """

    markup_tag = ''  # change in subclasses
    needle = ''  # for fuzzy search

    objects = ElementManager()
    parent_story = models.ForeignKey(Story)
    index = models.PositiveSmallIntegerField(
        default=0,
        blank=True, null=True,
        help_text=_('Leave blank to unpublish'),
        verbose_name=_('index'),
    )
    top = models.BooleanField(
        # editable=False,
        default=False,
        help_text=_('Is this element placed on top?'),
    )

    @property
    def published(self):
        return bool(self.index)

    def siblings(self):
        return self.__class__.objects.filter(parent_story=self.parent_story)

    def needle(self):
        return None

    def save(self, *args, **kwargs):
        if self.pk is None:
            if self.index == 0:
                last_item = self.siblings().filter(
                    index__isnull=False).order_by('index').last()
                if last_item:
                    # Set index to be higher than the previous object of the
                    # same class.
                    self.index = last_item.index + 1
                else:
                    self.index = 1

        super().save(*args, **kwargs)
        self.parent_story.clear_html()

    class Meta:
        verbose_name = _('story element')
        verbose_name_plural = _('story elements')
        ordering = ['index']


class Pullquote(TextContent, StoryElement):

    """ A quote that is that is pulled out of the content. """

    markup_tag = PULLQUOTE_TAG

    def needle(self):
        firstline = self.bodytext_markup.splitlines()[0]
        needle = re.sub('@\S+:|«|»', '', firstline)
        return needle

    class Meta:
        verbose_name = _('Pullquote')
        verbose_name_plural = _('Pullquotes')


class Aside(TextContent, StoryElement):

    """ Fact box or other information typically placed in side bar """

    markup_tag = ASIDE_TAG

    class Meta:
        verbose_name = _('Aside')
        verbose_name_plural = _('Asides')


class InlineHtml(StoryElement):

    """ Inline html code """

    markup_tag = INLINE_HTML_TAG

    bodytext_html = models.TextField()

    class Meta:
        verbose_name = _('Inline HTML block')
        verbose_name_plural = _('Inline HTML blocks')

    def get_html(self):
        """ Returns text content as html. """
        return mark_safe(self.bodytext_html)


class StoryMedia(StoryElement, MarkupModelMixin):

    """ Video, photo or illustration connected to a story """

    ORIGINAL_RATIO = 100.0
    DEFAULT_RATIO = 0.0

    ASPECT_RATIO_CHOICES = [
        (DEFAULT_RATIO, _('auto')),
        (round(2 / 5, 3), _('5:2 landscape')),
        (round(1 / 2, 3), _('2:1 landscape')),
        (round(2 / 3, 3), _('3:2 landscape')),
        (round(3 / 4, 3), _('4:3 landscape')),
        (round(1 / 1, 3), _('square')),
        (round(4 / 3, 3), _('3:4 portrait')),
        (round(3 / 2, 3), _('2:3 portrait')),
        (round(2 / 1, 3), _('1:2 portrait')),
        (ORIGINAL_RATIO, _('graph (force original ratio)')),
    ]

    class Meta:
        abstract = True

    caption = MarkupCharField(
        max_length=1000,
        help_text=_('Text explaining the media.'),
        verbose_name=_('caption'),
    )

    creditline = MarkupCharField(
        max_length=100,
        help_text=_('Extra information about media attribution and license.'),
        verbose_name=_('credit line'),
    )

    size = models.PositiveSmallIntegerField(
        default=1,
        help_text=_('Relative image size.'),
        verbose_name=_('image size'),
    )

    aspect_ratio = models.FloatField(
        verbose_name=_('aspect ratio'),
        help_text=_('height / width'),
        choices=ASPECT_RATIO_CHOICES,
        default=DEFAULT_RATIO,
    )

    def original_ratio(self):
        """ Width:Height ratio of the original media file. """
        return 2 / 1

    def get_height(self, width, height):
        """ Calculate pixel height based on builtin ratio """

        if self.aspect_ratio == self.DEFAULT_RATIO:
            height = height
        elif self.aspect_ratio == self.ORIGINAL_RATIO:
            height = width * self.original_ratio()
        else:
            height = width * self.aspect_ratio
        return int(height)

    def save(self, *args, **kwargs):
        self.caption = self.caption.replace('*', '')
        self.creditline = self.creditline.replace('*', '')
        if self.pk is None and not self.siblings().filter(top=True).exists():
            self.top = True
        super().save(*args, **kwargs)


class StoryImage(StoryMedia):

    """ Photo or illustration connected to a story """

    markup_tag = IMAGE_TAG

    class Meta:
        verbose_name = _('Image')
        verbose_name_plural = _('Images')

    imagefile = models.ForeignKey(
        ImageFile,
        help_text=_('Choose an image by name or upload a new one.'),
        verbose_name=('image file'),
    )

    def __str__(self):
        return str(self.imagefile)

    def original_ratio(self):
        return self.imagefile.full_height / self.imagefile.full_width

    def needle(self):
        """ Look for a name in the text """
        needle = re.sub(r'^.+:', '', self.caption)
        name = re.search(r'([A-ZÆØÅ]\w+ ){2,}', needle)
        if name:
            needle = name.group(0)
        return needle.strip()[:60] or str(self.imagefile)


class StoryVideo(StoryMedia):

    """ Video content connected to a story """

    markup_tag = VIDEO_TAG

    VIDEO_HOSTS = (
        ('vimeo', _('vimeo'),),
        ('youtu', _('youtube'),),
    )

    class Meta:
        verbose_name = _('Video')
        verbose_name_plural = _('Videos')

    video_host = models.CharField(
        max_length=20,
        default=VIDEO_HOSTS[0][0],
        choices=VIDEO_HOSTS,
    )

    host_video_id = models.CharField(
        max_length=100,
        verbose_name=_('id for video file.'),
        help_text=_(
            'the part of the url that identifies this particular video')
    )

    def embed(self, width="100%", height="auto"):
        """ Returns html embed code """
        if self.video_host == 'vimeo':
            # <iframe src="//player.vimeo.com/video/105149174?
            # title=0&amp;byline=0&amp;portrait=0&amp;color=f00008"
            # width="1200" height="675" frameborder="0"
            # webkitallowfullscreen mozallowfullscreen allowfullscreen>
            # </iframe>
            embed_pattern = (
                '<iframe src="//player.vimeo.com/'
                'video/{host_video_id}?title=0&amp;'
                'byline=0&amp;portrait=0&amp;color=f00008" '
                'width="{width}" frameborder="0" '
                'webkitallowfullscreen mozallowfullscreen allowfullscreen>'
                '</iframe>')
        elif self.video_host == 'youtu':
            # <iframe width="1280" height="720"
            # src="//www.youtube-nocookie.com/embed/HBk1GdcdALU?rel=0"
            # frameborder="0" allowfullscreen></iframe>
            embed_pattern = (
                '<iframe width="{width}" height="{height}" '
                'src="//www.youtube-nocookie.com/embed/{host_video_id}?'
                'rel=0" frameborder="0" allowfullscreen></iframe>'
            )
        else:
            raise Exception('unknown hosting site.')

        return embed_pattern.format(
            height=height, width=width, host_video_id=self.host_video_id,
        )

    @classmethod
    def create_from_url(cls, url, parent_story):
        """ create video object from input url """
        # url formats:
        # https://www.youtube.com/watch?v=roHl3PJsZPk
        # http://youtu.be/roHl3PJsZPk
        # http://vimeo.com/105149174

        def check_link(url, method='head', timeout=2):
            """ Does a http request to check the status of the url. """
            # TODO: check_link() er omtrent lik som metode med samme navn i
            # InlineLink
            try:
                status_code = str(
                    request(
                        method,
                        url,
                        timeout=timeout).status_code)
            except Timeout:
                status_code = 408  # HTTP Timout
            except MissingSchema:
                status_code = 0  # not a HTTP url
            return status_code

        for host in cls.VIDEO_HOSTS:
            hostname = host[0]
            if hostname in url:
                video_host = hostname
                break
        else:
            video_host = None

        if not check_link(url) == 200:
            # something is wrong with the url?
            return None

        id_regex = r'[a-zA-Z0-9]+$'
        host_video_id = re.search(id_regex, url)

        try:
            new_video = cls(
                parent_story=parent_story,
                video_host=video_host,
                host_video_id=host_video_id,
            )

            new_video.save()
            return new_video
        except Exception as e:
            logger.debug(e)
            return None


class InlineLinkManager(models.Manager):

    def markup_to_html(self, text):
        """ replace markup version of tag with html version """
        for link in self.all():
            text = link.markup_to_html(text)
        return text

    def insert_urls(self, text):
        """ insert url as reference in link """
        for link in self.all():
            text = link.insert_url(text)
        return text


class InlineLink(TimeStampedModel):

    # Link looks like this: [this is a link](www.universitas.no)
    # Or this:              [this is a link](1)

    # TOKEN_START, TOKEN_SEP, TOKEN_END = '¨', '|', '¨'
    find_pattern = '\[(?P<text>.+?)\]\((?P<ref>\S+?)\)'
    change_pattern = '[{text}]({ref})'
    html_pattern = '<a href="{href}" alt="{alt}">{text}</a>'
    objects = InlineLinkManager()

    class Meta:
        verbose_name = _('inline link')
        verbose_name_plural = _('inline links')

    parent_story = models.ForeignKey(
        Story,
        related_name='inline_links'
    )
    number = models.PositiveSmallIntegerField(
        default=1,
        help_text=_('link label'),
    )
    href = models.CharField(
        blank=True,
        max_length=500,
        help_text=_('link target'),
        verbose_name=_('link target'),
    )
    linked_story = models.ForeignKey(
        Story,
        blank=True, null=True,
        help_text=_('link to story on this website.'),
        verbose_name=_('linked story'),
        related_name='incoming_links',
    )
    alt_text = models.CharField(
        max_length=500,
        blank=True,
        help_text=_('alternate link text'),
        verbose_name=_('alt text'),
    )
    text = models.TextField(
        blank=True,
        editable=False,
        help_text=_('link text'),
        verbose_name=_('link text'),
    )
    status_code = models.CharField(
        max_length=3,
        editable=False,
        default='',
        choices=HTTP_STATUS_CODES,
        help_text=_('Status code returned from automatic check.'),
        verbose_name=_('http status code'),
    )

    def get_tag(self, ref=None):
        """ Get markup placeholder for the link """
        pattern = self.change_pattern
        return pattern.format(text=self.text, ref=ref or self.number)

    def markup_to_html(self, text):
        """ replace markup version of tag with html version """
        text = re.sub(re.escape(self.get_tag()), self.get_html(), text)
        return text

    def insert_url(self, text):
        """ insert url as reference in link """
        text = re.sub(
            re.escape(
                self.get_tag()), self.get_tag(
                ref=self.link), text)
        return text

    def get_html(self):
        """ get <a> html tag for the link """
        pattern = self.html_pattern
        html = pattern.format(
            text=self.text, href=self.link, alt=self.alt_text)
        return mark_safe(html)

    get_html.allow_tags = True

    @property
    def link(self):
        if self.linked_story:
            return self.linked_story.get_absolute_url()
        elif self.href:
            return self.href
        return ''

    def find_linked_story(self):
        """
        Change literal url to foreign key if the target is
        another article in the database.
        """
        if not self.href or self.linked_story:
            return False

        if not self.linked_story:
            try:
                match = re.search(
                    r'universitas.no/.+?/(?P<id>\d+)/', self.href)
                story_id = int(match.group('id'))
                self.linked_story = Story.objects.get(pk=story_id)
            except (AttributeError, ObjectDoesNotExist):
                # Not an internal link
                return False
        self.href = ''
        self.alt_text = self.linked_story.title
        return self.linked_story

    def save(self, *args, **kwargs):
        self.find_linked_story()
        super().save(*args, **kwargs)

    def check_link(self, save_if_changed=False, method='head', timeout=1):
        """ Does a http request to check the status of the url. """
        if self.linked_story:
            status_code = 'INT'
            url = self.validate_url(self.link)
        elif not self.link:
            status_code = ''
            url = ''
        else:
            url = self.validate_url(self.link)
            try:
                status_code = request(method, url, timeout=timeout).status_code
                if status_code == 410:
                    status_code = request(
                        'get',
                        url,
                        timeout=timeout).status_code
                if status_code > 500:
                    status_code = 500
                status_code = str(status_code)
            except Timeout:
                status_code = '408'  # HTTP Timout
            except MissingSchema:
                status_code = 'URL'  # not a HTTP url
            except ConnectionError:
                status_code = 'DNS'  # DNS error

        if save_if_changed and status_code != self.status_code:
            self.status_code = status_code
            self.save()

        msg = '{code}: {url}'.format(url=url, code=status_code)
        logger.debug(msg)
        return status_code

    @classmethod
    def clean_and_create_links(cls, body, parent_story):
        """
        Find markup links in text.
        Create new InlineLink objects if needed.
        Return text with updated markup for the changed links.
        """
        body = cls.convert_html_links(body)
        found_links = re.finditer(cls.find_pattern, body)
        queryset = parent_story.links()

        number = queryset.count() + 1
        for match in found_links:
            ref = match.group('ref')
            text = match.group('text')
            original_markup = re.escape(match.group(0))
            new_markup = []

            if re.match(r'^\d+$', ref):
                # ref is an integer
                ref = int(ref)
                links = queryset.filter(number=ref)
                if not links:
                    link = cls.objects.create(
                        number=ref,
                        parent_story=parent_story,
                    )
                else:
                    link = links[0]
                    if link.text != text:
                        link.text = text
                        link.save()

                    for otherlink in links[1:]:
                        otherlink.number = number
                        otherlink.save()
                        number += 1
                        msg = 'multiple links with same ref: ({0}) {1} {2}'
                        msg = msg.format(ref, link, otherlink)
                        logger.warn(msg)
                        new_markup.append(otherlink.get_tag())

            else:
                # ref is a url
                link = cls(
                    parent_story=parent_story,
                    href=ref,
                    number=number,
                    alt_text=text,
                    text=text,
                )
                number += 1
                link.save()

            new_markup = [link.get_tag()] + new_markup
            new_markup = ' '.join(new_markup)

            body = re.sub(original_markup, new_markup, body)
        return body

    @classmethod
    def convert_html_links(cls, bodytext, return_html=False):
        """ convert <a href=""> to other tag """
        # if '&' in bodytext:
        # find = re.findall(r'.{,20}&.{,20}', bodytext)
        # logger.debug(find)
        soup = BeautifulSoup(bodytext, 'html5lib')
        for link in soup.find_all('a'):
            href = link.get('href') or ''
            text = link.text
            href = cls.validate_url(href)
            if href:
                replacement = cls.change_pattern.format(
                    ref=href.strip(),
                    text=text.strip(),
                )
            else:
                # <a> element with no href
                replacement = '{text}'.format(text=text,)

            # change the link from html to markup
            link.replace_with(replacement)

        if return_html:
            bodytext = soup.decode()
        else:
            bodytext = soup.text
        return bodytext

    @classmethod
    def validate_url(cls, href):
        """ Checks if input string is a valid http href. """
        site = settings.SITE_URL  # todo - get from settings.
        href = href.strip('«»“”"\'')
        if href.startswith('//'):
            href = 'http:{href}'.format(href=href)
        if href.startswith('/'):
            href = 'http://{site}{href}'.format(site=site, href=href)
        if not href.startswith('http://'):
            href = 'http://{href}'.format(href=href)
        try:
            validate = URLValidator()
            validate(href)
            return href
        except ValidationError:
            return None


class BylineManager(models.Manager):

    def ordered(self):
        return self.order_by('ordering', 'pk')


class Byline(models.Model):

    """ Credits the people who created content for a story. """

    CREDIT_CHOICES = [
        ('by', _('By')),
        ('text', _('Text')),
        ('video', _('Video')),
        ('photo', _('Photo')),
        ('video', _('Video')),
        ('illustration', _('Illustration')),
        ('graphics', _('Graphics')),
        ('translation', _('Translation')),
        ('text and photo', _('TextPhoto')),
        ('text and video', _('TextVideo')),
        ('photo and video', _('PhotoVideo')),
    ]
    DEFAULT_CREDIT = CREDIT_CHOICES[0][0]
    objects = BylineManager()
    story = models.ForeignKey(Story)
    contributor = models.ForeignKey(Contributor)
    ordering = models.IntegerField(default=1)
    credit = models.CharField(
        choices=CREDIT_CHOICES,
        default=DEFAULT_CREDIT,
        max_length=20,
    )
    title = models.CharField(
        blank=True,
        null=True,
        max_length=200,
    )

    class Meta:
        verbose_name = _('Byline')
        verbose_name_plural = _('Bylines')

    def __str__(self):
        return '{credit}: {full_name} ({story_title})'.format(
            credit=self.get_credit_display(),
            full_name=self.contributor,
            story_title=self.story,
        )

    @classmethod
    def create(cls, full_byline, story, initials=''):
        """
        Creates new user or tries to find existing name in db
        args:
            full_byline: string of byline and creditline
            article: Article object (must be saved)
            initials: string
        returns:
            Byline object
        """
        byline_pattern = re.compile(
            # single word credit with colon. Person's name, Person's job title
            # or similiar description.
            # Example:
            # text: Jane Doe, Just a regular person
            r'^(?P<credit>[^:]+): (?P<full_name>[^,]+)\s*(, (?P<title>.+))?$',
            flags=re.UNICODE,
        )

        match = byline_pattern.match(full_byline)
        full_name = None
        try:
            d = match.groupdict()
            full_name = d['full_name'].title()
            title = d['title'] or ''
            credit = d['credit'].lower()
            initials = ''.join(
                letters[0] for letters in full_name.replace(
                    '-',
                    ' ').split())
            assert initials == initials.upper(
            ), 'All names should be capitalised'
            assert len(
                initials) <= 5, 'Five names probably means something is wrong.'
            if len(initials) == 1:
                initials = full_name.upper()

        except (AssertionError, AttributeError, ) as e:
            # Malformed byline
            p_org = w_org = ' -- '
            if story.legacy_prodsys_source:
                dump = story.legacy_prodsys_source
                tekst = json.loads(dump)[0]['fields']['tekst']
                p_org = needle_in_haystack(full_byline, tekst)
            if story.legacy_html_source:
                dump = story.legacy_html_source
                w_org = json.loads(dump)[0]['fields']['byline']

            warning = ((
                'Malformed byline: "{byline}" error: {error} id: {id}'
                ' p_id: {p_id}\n{p_org} | {w_org} ').format(
                id=story.id,
                p_id=story.prodsak_id,
                # story=story,
                byline=full_byline,
                error=e,
                p_org=p_org,
                w_org=w_org,
            ))
            logger.warn(warning)
            story.comment += warning
            story.publication_status = Story.STATUS_ERROR

            full_name = 'Nomen Nescio'
            title = full_byline
            initials = 'XX'
            credit = '???'

        for choice in cls.CREDIT_CHOICES:
            # Find correct credit.
            ratio = difflib.SequenceMatcher(
                None,
                choice[0],
                credit[:],
            ).ratio()
            if .4 > ratio > .8:
                logger.debug(choice[0], credit, ratio)
            if ratio > .8:
                credit = choice[0]
                break
        else:
            credit = cls.DEFAULT_CREDIT

        contributors = Contributor.get_or_create(
            full_name,
            initials
        )

        for contributor in contributors:
            new_byline = cls(
                story=story,
                credit=credit,
                title=title[:200],
                contributor=contributor,
            )
            new_byline.save()


def needle_in_haystack(needle, haystack):
    """ strips away all spaces and puctuations before comparing. """
    needle = re.sub(r'\W', '', needle).lower()
    diff = diff_match_patch()
    diff.Match_Distance = 5000  # default is 1000
    diff.Match_Threshold = .5  # default is .5
    lines = haystack.splitlines()
    for line in lines:
        line2 = re.sub(r'\W', '', line).lower()
        value = diff.match_main(line2, needle, 0)
        if value is not -1:
            return line
    return 'no match in %d lines' % (len(lines),)
