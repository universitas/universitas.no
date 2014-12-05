# -*- coding: utf-8 -*-
""" Content in the publication. """

# Python standard library
import re
import difflib
import logging
import json
logger = logging.getLogger('universitas')

# Django core
from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from django.utils import timezone
from django.utils import translation
from django.db import models
from django.core.cache import cache
from django.utils.text import slugify
from django.core.exceptions import ObjectDoesNotExist
from django.core.validators import URLValidator, ValidationError
from django.utils.safestring import mark_safe
from django.core.urlresolvers import reverse
from django.template import Context, Template

# Installed apps
from bs4 import BeautifulSoup
from diff_match_patch import diff_match_patch
from requests import request
from requests.exceptions import Timeout, MissingSchema, ConnectionError
from model_utils.models import TimeStampedModel

# Project apps
from myapps.contributors.models import Contributor
from myapps.markup.models import BlockTag, InlineTag, Alias
from myapps.photo.models import ImageFile
from myapps.frontpage.models import FrontpageStory
# from myapps.issues.models import PrintIssue

from .status_codes import HTTP_STATUS_CODES


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

    def __str__(self):
        return self.title

    @property
    def slug(self):
        return slugify(self.title)

    @models.permalink
    def get_absolute_url(self):
        return ('')


class StoryType(models.Model):

    """ A type of story in the publication. """

    name = models.CharField(unique=True, max_length=50)
    section = models.ForeignKey(Section)
    template = models.ForeignKey('Story', blank=True, null=True)
    prodsys_mappe = models.CharField(
        blank=True, null=True,
        max_length=20)

    class Meta:
        verbose_name = _('StoryType')
        verbose_name_plural = _('StoryTypes')

    def __str__(self):
        return self.name

    @models.permalink
    def get_absolute_url(self):
        return ('')


class TextContent(TimeStampedModel):

    """ Abstract superclass for stories and related text elements. """

    class Meta:
        abstract = True

    bodytext_markup = models.TextField(
        blank=True,
        default='',
        help_text=_('Content with xtags markup.'),
        verbose_name=_('bodytext tagged text')
    )

    bodytext_html = models.TextField(
        blank=True,
        editable=False,
        default='<p>Placeholder</p>',
        help_text=_('HTML tagged content'),
        verbose_name=_('bodytext html tagged')
    )

    def get_html(self):
        """ Returns text content as html. """
        return mark_safe(self.bodytext_html)

    def save(self, *args, **kwargs):
        try:
            saved_markup = type(self).objects.get(pk=self.pk).bodytext_markup
        except ObjectDoesNotExist:
            super().save(*args, **kwargs)
            saved_markup = ''

        if saved_markup != self.bodytext_markup:
            # bodytext has been changed - clean and convert contents.
            self.clean_markup()
            self.make_html()
            self.insert_links()

        super().save(*args, **kwargs)

    def clean_markup(self):
        """ Cleans up and normalises raw input from user or import. """
        bodytext = []
        for paragraph in self.bodytext_markup.splitlines():
            paragraph = Alias.objects.replace(content=paragraph, timing=Alias.TIMING_IMPORT)
            bodytext.append(paragraph)
        bodytext = '\n'.join(bodytext)
        bodytext = Alias.objects.replace(content=bodytext, timing=Alias.TIMING_EXTRA)
        self.bodytext_markup = bodytext
        self.insert_links()

    def make_html(self):
        """ Create html body text from markup """
        html_blocks = ['{% load inline_elements %}']
        body = self.bodytext_markup

        tag_template = '{{% inline_{classname} "\\1" %}}'
        regex = '^{markup_tag} *(.*) *$'

        for cls in (StoryImage, Pullquote, Aside, StoryVideo):
            classname = cls.__name__.lower().replace(' ', '')
            find = regex.format(markup_tag=cls.markup_tag)
            replace = tag_template.format(classname=classname)
            body = re.sub(find, replace, body, flags=re.M)
        # logger.warn(str(re.findall(r'{%.*?%}', body)))

        paragraphs = body.splitlines()

        for paragraph in paragraphs:
            if not paragraph.startswith('{'):
                paragraph = BlockTag.objects.make_html(paragraph)
            html_blocks.append(paragraph)

        bodytext_html = '\n'.join(html_blocks)

        bodytext_html = Template(bodytext_html).render(Context({"story": self}))

        bodytext_html = BeautifulSoup(bodytext_html).prettify()

        bodytext_html = InlineTag.objects.make_html(bodytext_html)

        self.bodytext_html = bodytext_html

    def insert_links(self):
        if hasattr(self, 'parent_story'):
            parent_story = self.parent_story
        else:
            parent_story = self
        new_html, new_body = InlineLink.find_links(self, parent_story)
        self.bodytext_markup = new_body
        self.bodytext_html = new_html

    def parse_markup(self):
        """ Use raw input tagged text to populate fields and create related objects """
        paragraphs = self.bodytext_markup.splitlines()
        self.bodytext_markup = ''

        target = self
        # Target is the model instance that will receive following line of text.
        # It could be the main article, or some related element, such as multi
        # paragraph aside.
        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            if paragraph == "":
                continue
            blocktag = BlockTag.objects.match_or_create(paragraph)
            tag, text_content = blocktag.split(paragraph)
            if re.match(r'^\s*$', text_content):
                # no text_content
                continue
            function_name, target_field = blocktag.action.split(':')
            # The Blocktag model contains instructions for the various kinds of block (paragraph) level tags
            # that are in use. Actions are "_block_append", "_block_new" and "_block_drop".
            action = getattr(target, '_block_{func}'.format(func=function_name))
            # do action on
            new_target = action(tag, text_content, target_field)
            # new target could be newly created object or a parent element.
            if new_target != target != self:
                # This story element is completed.
                target.save()
            target = new_target

        if target != self:
            target.save()

    def _block_append(self, tag, content, modelfield=None):
        """ Appends content(string) to a model field by string reference. """
        # default is to add to body text
        modelfield = modelfield or 'bodytext_markup'
        if modelfield != 'bodytext_markup':
            # only body text needs block tags.
            tag = ''
        try:
            # since we use a sting reference, model fields are accessed with getattr() and setattr()
            # if field / attribute does not exist, an AttributeError will be raised.
            # if field does not contain string data, AssertionError will be raised.
            assert isinstance(getattr(self, modelfield), str)

            # new string in field
            new_content = '{old_content}\n{tag}{added_content}'.format(
                old_content=getattr(self, modelfield),
                tag=tag,
                added_content=content,
            ).strip()
            # update modelfield
            setattr(self, modelfield, new_content)
            return self
        except (AttributeError,):
            # No such field. Try the main story instead.
            return self.parent_story._block_append(tag, content, modelfield)
        except (AssertionError,) as errormsg:
            raise TypeError(
                'Tried to append text to field {class_name}.{field}\n{errormsg}'.format(
                    class_name=self.__class__.__name__,
                    field=modelfield,
                    errormsg=errormsg,
                ),
            )

    def _block_new(self, *args, **kwargs):
        """ Create new related story element. """
        # Send control up to parent story instance.
        return self.parent_story._block_new(*args, **kwargs)

    def _block_drop(self, *args, **kwargs):
        """ Returns self and ignores any arguments """
        # The most reliable place to put this important data is /dev/null
        return self


class PublishedStoryManager(models.Manager):

    def published(self):
        now = timezone.now()
        return super().get_queryset().filter(publication_status=Story.STATUS_PUBLISHED).filter(publication_date__lt=now)

    def populate_frontpage(self):
        """ create some random frontpage stories """
        FrontpageStory.objects.all().delete()
        # TODO: Funker bare for 2014
        new_stories = self.filter(publication_date__year=2014).order_by('publication_date')
        for story in new_stories:
            story.save()


class Story(TextContent):

    """ An article or story in the newspaper. """

    class Meta:
        verbose_name = _('Story')
        verbose_name_plural = _('Stories')

    objects = PublishedStoryManager()

    STATUS_DRAFT = 0
    STATUS_EDITOR = 5
    STATUS_READY = 9
    STATUS_PUBLISHED = 10
    STATUS_PRIVATE = 15
    STATUS_ERROR = 500
    STATUS_CHOICES = [
        (STATUS_DRAFT, _('Draft')),
        (STATUS_EDITOR, _('Ready to edit')),
        (STATUS_READY, _('Ready to publish on website')),
        (STATUS_PUBLISHED, _('Published on website')),
        (STATUS_PRIVATE, _('Will not be published')),
        (STATUS_ERROR, _('Technical error')),
    ]

    prodsak_id = models.PositiveIntegerField(
        blank=True, null=True, editable=False,
        help_text=_('primary id in the legacy prodsys database.'),
        verbose_name=_('prodsak id')
    )
    title = models.CharField(
        max_length=1000,
        help_text=_('main headline or title'),
        verbose_name=_('title'),
    )
    kicker = models.CharField(
        blank=True, max_length=1000,
        help_text=_('secondary headline, usually displayed above main headline'),
        verbose_name=_('kicker'),
    )
    lede = models.TextField(
        blank=True,
        help_text=_('brief introduction or summary of the story'),
        verbose_name=_('lede'),
    )
    comment = models.TextField(
        default='', blank=True,
        help_text=_('for internal use only'),
        verbose_name=_('comment'),
    )
    theme_word = models.CharField(
        blank=True, max_length=100,
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
    slug = models.SlugField(
        default='slug-here', editable=False,
        help_text=_('human readable url.'),
        verbose_name=_('slug'),
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
        default=0,
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

    # @property
    def pullquotes(self):
        return self.storyelement_set.pullquotes()

    # @property
    def asides(self):
        return self.storyelement_set.asides()

    # @property
    def images(self):
        return self.storyelement_set.images()

    # @property
    def videos(self):
        return self.storyelement_set.videos()

    def visit_page(self, request):
        """ Check if visit looks like a human and update hit count """
        if not self.status == self.STATUS_PUBLISHED:
            # Must be a member of staff.
            return False
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
        if not user_agent:
            # Visitor is not using a web browser. Not sure if this ever happens, but it would not be a proper visit.
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
        self.hot_count = models.F('hot_count') + 1
        self.save(update_fields=['hit_count', 'hot_count'])
        return True

    def __str__(self):
        if self.publication_date:
            return '{} {:%Y-%m-%d}'.format(self.title, self.publication_date)
        else:
            return '{}'.format(self.title,)

    def get_bylines_as_html(self):
        """ create html table of bylines in db for search and admin display """
        translation.activate(settings.LANGUAGE_CODE)
        all_bylines = ['<table class="admin-bylines">']
        for bl in self.byline_set.select_related('contributor'):
            all_bylines.append(
                '<tr><td>{}</td><td>{}</td><td>{}</td></tr>'.format(
                    bl.get_credit_display(),
                    bl.contributor.display_name,
                    bl.title,
                )
            )
        translation.deactivate()
        all_bylines.append('</table>')
        return '\n'.join(all_bylines)

    def image_count(self):
        # TODO: Move to admin? Only used in admin listview
        return len(self.images())

    @property
    def section(self):
        """ Shortcut to related Section """
        return self.story_type.section

    def save(self, *args, new=False, **kwargs):
        new = self.pk is None or new
        # slugify title. Remove underscores and n-dash. If slug has been changed,
        # old url will redirect to new url with status code 301.
        self.slug = slugify(self.title).replace('_', '').replace('–', '-')[:50]
        # bylines are cached in a modelfield for quicker search and admin display,
        # avoiding joins and extra queries Only used in back-end
        self.bylines_html = self.get_bylines_as_html()

        if not self.publication_date and self.publication_status == self.STATUS_PUBLISHED:
            self.publication_date = timezone.now()

        super().save(*args, **kwargs)

        if new:
            # When the story is created
            # make inline elements
            self.bodytext_markup = self.insert_all_inline_elements()
            super().save(*args, **kwargs)

            if self.images() and self.frontpagestory_set.count() == 0:
                # create a frontpagestory only if there are linked images. This avoids an
                # empty frontpagestory when the model is initally saved before any related
                # storyimage instances exist.
                frontpagestory = FrontpageStory(
                    story=self,
                )
                frontpagestory.save()

    def get_edit_url(self):
        url = reverse(
            'admin:{app}_{object}_change'.format(
                app=self._meta.app_label,
                object=self._meta.model_name,
            ),
            args=[self.id],
        )
        return url

    def get_absolute_url(self):
        url = reverse(
            viewname='article',
            kwargs={
                'story_id': str(self.id),
                'section': self.section.slug,
                'slug': self.slug,
            },)
        return url

    def make_html(self):
        super().make_html()
        # for link in self.inline_links.all():
            # self.bodytext_html = link.insert_html(self.bodytext_html)

    def clean_markup(self, *args, **kwargs):
        """ Clean user input and populate fields """
        self.bodytext_markup = self.reindex_inlines()
        super().clean_markup(*args, **kwargs)
        self.parse_markup()

    def _block_new(self, tag, content, element):
        """ Add a story element to the main story """
        if element == "byline":
            bylines_raw = clean_up_bylines(content)
            for raw_byline in bylines_raw.splitlines():
                Byline.create(
                    story=self,
                    full_byline=raw_byline,
                    initials='',  # TODO: send over initials?
                )
            return self
        elif element == "aside":
            new_element = Aside(parent_story=self, )
        elif element == "pullquote":
            new_element = Pullquote(parent_story=self, )
        return new_element._block_append(tag, content)

    def insert_all_inline_elements(self):
        """ Insert inline elements into the bodytext according to heuristics. """

        def _main(self=self, body=self.bodytext_markup):
            # insert asides
            asides = self.asides().inline()
            body = top_right(asides, body)

            # insert images
            images = self.images().inline()
            body = fifty_fifty(images, body)

            # insert videos
            videos = self.videos().inline()
            body = fifty_fifty(videos, body)

            # insert pullquotes
            pullquotes = self.pullquotes().inline()
            body = fuzzy_search(pullquotes, body)

            return body

        def fifty_fifty(queryset, body):
            """ Half of elements in header, rest spread evenly through body. """
            # TODO: Denne legger til i bunn nå.
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
            diff = diff_match_patch()
            diff.Match_Distance = 5000  # default is 1000
            diff.Match_Threshold = .25  # default is .5

            def _find_in_text(needle, haystack):
                """ strips away all spaces and puctuations before comparing. """
                needle = re.sub(r'\W', '', needle).lower()
                haystack = re.sub(r'\W', '', haystack).lower()
                value = diff.match_main(haystack, needle, 0)
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
            return body

        return _main()

    def find_inline_placeholders(self, element_class, body):
        regex = r'^{}\s*(.*)\s*$'.format(element_class.markup_tag)
        FLAGS = ['<', '>']
        matches = re.finditer(regex, body, flags=re.M)
        result = []
        for match in matches:
            elements = re.split(r'[\s,]+', match.group(1))
            result.append(
                {
                    'elements': elements,
                    'line': match.group(0),
                    'flags': [item for item in elements if item in FLAGS],
                    'indexes': [int(index) for index in elements if index.isdigit()],
                }
            )
        return result

    def reindex_inlines(self, element_classes=None, body=None):
        """
        Change placeholders in bodytext markup.
        Updates indexes in related elements to match.
        Remove orphan placeholders.
        """
        body = body or self.bodytext_markup
        element_classes = element_classes or [Aside, StoryImage, StoryVideo, Pullquote]

        for element_class in element_classes:

            elements = {}
            top_index = 0
            body_changed = False
            elements_changed = False

            subclass = element_class.__name__.lower()
            placeholders = self.find_inline_placeholders(element_class, body)
            queryset = self.storyelement_set.filter(_subclass=subclass, top=False)

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
                            if (element.index, element.top) != (this_index, False):
                                elements_changed = True
                                element.index = this_index
                                element.top = False
                        if not this_index in replace:
                            replace.append(this_index)
                        else:
                            pass
                            # logger.warn('duplicate index: ' + placeholder['line'])
                if replace:
                    replace = [element_class.markup_tag] + [str(r) for r in placeholder['flags'] + replace]
                placeholder['replace'] = ' '.join(replace)

                if placeholder['line'] != placeholder['replace']:
                    body_changed = True

                # logger.warn('\nflags: {flags}\nindexes: {indexes}\n {line} -> {replace}'.format(**placeholder)))

            if elements_changed:
                for element in elements.values():
                    element.save()

            if body_changed:
                for placeholder in placeholders:
                    old_line = re.compile('^' + placeholder['line'] + '$', flags=re.M)
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


class ElementManager(models.Manager):

    def get_queryset(self):
        return ElementQuerySet(self.model, using=self._db)

    def __getattr__(self, attr, *args):
        """ Checks the queryset class for missing methods. """
        try:
            return super().__getattr__(attr, *args)
        except AttributeError:
            return getattr(self.get_queryset(), attr, *args)


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


class StoryElement(RemembersSubClass):

    """ Models that are placed somewhere inside an article """

    markup_tag = ''  # change in subclasses
    needle = ''  # for fuzzy search

    objects = ElementManager()
    parent_story = models.ForeignKey('Story')
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

    def siblings(self):
        return self.__class__.objects.filter(parent_story=self.parent_story)

    def needle(self):
        return None

    def save(self, *args, **kwargs):
        if self.pk is None:
            if self.index == 0:
                last_item = self.siblings().filter(index__isnull=False).order_by('index').last()
                if last_item:
                    # Set index to be higher than the previous object of the same class.
                    self.index = last_item.index + 1
                else:
                    self.index = 1

        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _('story element')
        verbose_name_plural = _('story elements')
        ordering = ['index']


class Pullquote(TextContent, StoryElement):

    """ A quote that is that is pulled out of the content. """

    markup_tag = '@quote:'

    def needle(self):
        firstline = self.bodytext_markup.splitlines()[0]
        needle = re.sub('@\S+:|«|»', '', firstline)
        return needle

    class Meta:
        verbose_name = _('Pullquote')
        verbose_name_plural = _('Pullquotes')


class Aside(TextContent, StoryElement):

    """ Fact box or other information typically placed in side bar """

    markup_tag = '@box:'

    class Meta:
        verbose_name = _('Aside')
        verbose_name_plural = _('Asides')


class StoryMedia(StoryElement):

    """ Video, photo or illustration connected to a story """

    class Meta:
        abstract = True

    caption = models.CharField(
        blank=True, max_length=1000,
        help_text=_('Text explaining the media.'),
        verbose_name=_('caption'),
    )

    creditline = models.CharField(
        blank=True, max_length=100,
        help_text=_('Extra information about media attribution and license.'),
        verbose_name=_('credit line'),
    )

    size = models.PositiveSmallIntegerField(
        default=1,
        help_text=_('Relative image size.'),
        verbose_name=_('image size'),
    )

    def save(self, *args, **kwargs):
        self.caption = self.caption.replace('*', '')
        self.creditline = self.creditline.replace('*', '')
        if self.pk is None and not self.siblings().filter(top=True).exists():
            self.top = True
        super().save(*args, **kwargs)


class StoryImage(StoryMedia):

    """ Photo or illustration connected to a story """

    markup_tag = '@image:'

    class Meta:
        verbose_name = _('Image')
        verbose_name_plural = _('Images')

    imagefile = models.ForeignKey(
        ImageFile,
        help_text=_('Choose an image by name or upload a new one.'),
        verbose_name=('image file'),
    )

    def needle(self):
        return str(self.imagefile)


class StoryVideo(StoryMedia):

    """ Video content connected to a story """

    markup_tag = '@video:'

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
        help_text=_('the part of the url that identifies this particular video'),
    )

    def embed(self, width=1200, height=600):
        """ Returns html embed code """
        if self.video_host == 'vimeo':
            # <iframe src="//player.vimeo.com/video/105149174?title=0&amp;byline=0&amp;portrait=0&amp;color=f00008"
            # width="1200" height="675" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>
            # </iframe>
            embed_pattern = (
                '<iframe src="//player.vimeo.com/'
                'video/{host_video_id}?title=0&amp;byline=0&amp;portrait=0&amp;color=f00008" '
                'width="{width}" height="{height}" frameborder="0" '
                'webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
            )
        elif self.video_host == 'youtu':
            # <iframe width="1280" height="720" src="//www.youtube-nocookie.com/embed/HBk1GdcdALU?rel=0"
            # frameborder="0" allowfullscreen></iframe>
            embed_pattern = (
                '<iframe width="{width}" height="{heigth}" '
                'src="//www.youtube-nocookie.com/embed/{host_video_id}?'
                'rel=0" frameborder="0" allowfullscreen></iframe>'
            )
        else:
            raise Exception('unknown hosting site.')

        return embed_pattern.format(height=height, width=width, host_video_id=self.host_video_id,)

    @classmethod
    def create_from_url(cls, url, parent_story):
        """ create video object from input url """
        # url formats:
        # https://www.youtube.com/watch?v=roHl3PJsZPk
        # http://youtu.be/roHl3PJsZPk
        # http://vimeo.com/105149174

        def check_link(url, method='head', timeout=2):
            """ Does a http request to check the status of the url. """
            # TODO: samme metode som i inlinelink.
            try:
                status_code = str(request(method, url, timeout=timeout).status_code)
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


class InlineLink(models.Model):

    # Link looks like this: [this is a link](www.universitas.no)
    # Or this:              [this is a link](1)

    # TOKEN_START, TOKEN_SEP, TOKEN_END = '¨', '|', '¨'
    find_pattern = '\[(?P<text>.+?)\]\((?P<ref>\S+?)\)'
    change_pattern = '[{text}]({ref})'
    html_pattern = '<a href="{href}" alt="{alt}">{text}</a>'

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

    @property
    def link(self):
        if self.linked_story:
            return self.linked_story.get_absolute_url()
        elif self.href:
            return self.href
        return ''

    def find_linked_story(self):
        """ Change literal url to foreign key if the target is another article in the database. """
        if not self.href or self.linked_story:
            return False

        if not self.linked_story:
            try:
                match = re.search(r'universitas.no/.+?/(?P<id>\d+)/', self.href)
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
                    status_code = request('get', url, timeout=timeout).status_code
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

        logger.debug('{code}: {url}'.format(url=url, code=status_code))
        return status_code

    @classmethod
    def find_links(cls, text_content, parent_story):
        """
        Find links in TextContent bodytext and convert them to InlineLink instances.
        Then update link tags in both bodytext and html
        """
        new_body = text_content.bodytext_markup
        new_html = text_content.bodytext_html

        new_body = cls.convert_html_links(new_body)
        found_links = re.finditer(cls.find_pattern, new_body)

        for number, match in enumerate(found_links):
            ref = match.group('ref')
            text = match.group('text')

            if re.match(r'^\d+$', ref):
                ref = int(ref)
                links = cls.objects.filter(number=ref, parent_story=parent_story,)
                if not links:
                    link = cls.objects.create(number=ref, parent_story=parent_story,)
                else:
                    # Duplicates might happen.
                    link = links.first()
                    links = links.exclude(pk=link.pk)
                    if links:
                        error_message = 'Links are messed up ' + ' '.join(l.href for l in links)
                        logger.error(error_message)
                        parent_story.comment += error_message
                        parent_story.publication_status = Story.STATUS_ERROR
                        # links = links.exclude(pk=link.pk)
                        # if links.count() == links.filter(href=link.href).count():
                            # links.delete()

                link.text = text
                if ref > number:
                    link.number = number
                link.save()
            else:
                link = cls(
                    parent_story=parent_story,
                    href=ref,
                    number=number,
                    alt_text=text,
                    text=text,
                )
                link.save()

            original_markup = re.escape(match.group(0))
            new_body = re.sub(original_markup, link.get_tag(), new_body)
            new_html = re.sub(original_markup, link.get_html(), new_html)

        return new_html, new_body

    def get_tag(self):
        pattern = self.change_pattern
        return pattern.format(text=self.text, ref=self.number)

    def get_html(self):
        pattern = self.html_pattern
        html = pattern.format(text=self.text, href=self.link, alt=self.alt_text)
        return mark_safe(html)

    get_html.allow_tags = True

    @classmethod
    def convert_html_links(cls, bodytext, formatter=None):
        """ convert <a href=""> to other tag """
        # if '&' in bodytext:
            # find = re.findall(r'.{,20}&.{,20}', bodytext)
            # logger.debug(find)
        soup = BeautifulSoup(bodytext)
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

            # change the link from html to simple-tags
            link.replace_with(replacement)
            # logger.debug('found link: {link} - replace with: {replacement}'.format(link=link, replacement=replacement))

        return soup.decode(formatter=formatter)

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


class Byline(models.Model):

    """ Credits the people who created content for a story. """

    CREDIT_CHOICES = [
        ('text', _('Text')),
        ('photo', _('Photo')),
        ('video', _('Video')),
        ('illus', _('Illustration')),
        ('graph', _('Graphics')),
        ('trans', _('Translation')),
        ('???', _('Unknown')),
    ]
    DEFAULT_CREDIT = CREDIT_CHOICES[0][0]
    story = models.ForeignKey(Story)
    contributor = models.ForeignKey(Contributor)
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
            # single word credit with colon. Person's name, Person's job title or similiar description.
            # Example:
            # text: Jane Doe, Just a regular person
            r'^(?P<credit>[^:, ]+): (?P<full_name>[^,]+)\s*(, (?P<title>.+))?$',
            flags=re.UNICODE,
        )

        match = byline_pattern.match(full_byline)
        full_name = None
        try:
            d = match.groupdict()
            full_name = d['full_name'].title()
            title = d['title'] or ''
            credit = d['credit'].lower()
            initials = ''.join(letters[0] for letters in full_name.replace('-', ' ').split())
            assert initials == initials.upper(), 'All names should be capitalised'
            assert len(initials) <= 5, 'Five names probably means something is wrong.'
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

            warning = (
                'Malformed byline: "{byline}" error: {error} id: {id} p_id: {p_id}\n{p_org} | {w_org} '.format(
                    id=story.id,
                    p_id=story.prodsak_id,
                    story=story,
                    byline=full_byline,
                    error=e,
                    p_org=p_org,
                    w_org=w_org,
                )
            )
            logger.warn(warning)
            story.comment += warning
            story.publication_status = Story.STATUS_ERROR

            full_name, title, initials, credit = 'Nomen Nescio', full_byline, 'XX', '???'

        for choice in cls.CREDIT_CHOICES:
            # Find correct credit.
            ratio = difflib.SequenceMatcher(
                None,
                choice[0],
                credit[:5],
            ).ratio()
            if .4 > ratio > .8:
                logger.debug(choice[0], credit, ratio)
            if ratio > .8:
                credit = choice[0]
                break
        else:
            credit = cls.DEFAULT_CREDIT

        contributor = Contributor.get_or_create(full_name, initials)

        new_byline = cls(
            story=story,
            credit=credit,
            title=title[:200],
            contributor=contributor,
        )
        new_byline.save()

        return new_byline


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


def clean_up_bylines(bylines):
    """
    Normalise misformatting and idiosyncraticies of bylines in legacy data.
    string -> string
    """
    replacements = (
        # Symbols used to separate individual bylines.
        (r'\r|;|•|\*|·|/', r'\n', re.I),

        # No full stops
        (r'\.', r' ', re.I),

        # A word that ends with colon must be at the beginning of a line.
        (r' +(\S*?:)', r'\n\1', 0),


        # comma, and or "og" before two capitalised words probably means it's a new person. Insert newline.
        (r'\s*(,\s|\s[oO]g\s|\s[aA]nd\s)\s*([A-ZÆØÅ]\S+ [A-ZÆØÅ])', r'\n\2', 0),
        # TODO: Bytt ut byline regular expression med ny regex-modul som funker med unicode

        # parantheses shall have no spaces inside them, but after and before.
        (r' *\( *(.*?) *\) *', ' (\1) ', 0),

        # email addresses will die!
        (r'\S+@\S+', '', 0),

        # words in parantheses at end of line is probably some creditation. Put in front with colon instead.
        (r'^(.*?) *\(([^)]*)\) *$', r'\2: \1', re.M),

        # "Anmeldt av" is text credit.
        (r'anmeldt av:?', 'text: ', re.I),

        # Oversatt = translatrion
        (r'oversatt av:?', 'translation: ', re.I),

        # Any word containging "photo" is some kind of photo credit.
        (r'\S*(ph|f)oto\S*?[\s:]*', '\nphoto: ', re.I),

        # Any word containing "text" is text credit.
        (r'\S*te(ks|x)t\S*?[\s:]*', '\ntext: ', re.I),

        # These words are stripped from end of line.
        (r' *(,| og| and) *$', '', re.M | re.I),

        # These words are stripped from start of line
        (r'^ *(,|og |and |av ) *', '', re.M | re.I),

        # These words are stripped from after colon
        (r': *(,|og |and |av ) *', ':', re.M | re.I),

        # Creditline with empty space after it is deleted.
        (r'^\S:\s*$', '', re.M),

        # Multiple spaces.
        (r' {2,}', ' ', 0),

        # Remove lines containing only whitespace.
        (r'\s*\n\s*', r'\n', 0),

        # Bylines with no credit are assumed to be text credit.
        (r'^([^:]+?)$', r'text:\1', re.M),

        # Exactly one space after and no space before colon or comma.
        (r'\s*([:,])+\s*', r'\1 ', 0),

        # No multi colons
        (r': *:', r':', 0),

        # No random colons at the start or end of a line
        (r'^\s*:', r'', re.M),
        (r':\s*$', r'', re.M),
    )

    # logger.debug('\n', bylines)
    byline_words = []
    for word in bylines.split():
        if word == word.upper():
            word = word.title()
        byline_words.append(word)

    bylines = ' '.join(byline_words)
    # logger.debug(bylines)

    for pattern, replacement, flags in replacements:
        bylines = re.sub(pattern, replacement, bylines, flags=flags)
    bylines = bylines.strip()
    # logger.debug(bylines)
    return bylines
