# -*- coding: utf-8 -*-
""" Content in the publication. """

# Python standard library
import re
# import html
from collections import defaultdict

# Django core
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.template.defaultfilters import slugify
from django.core.exceptions import ObjectDoesNotExist
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.safestring import mark_safe
from django.db.models.fields import FieldDoesNotExist
# Installed apps
from model_utils.models import TimeStampedModel
# Project apps
from myapps.contributors.models import Contributor
from myapps.markup.models import BlockTag, InlineTag, Alias
from myapps.photo.models import ImageFile
from myapps.frontpage.models import FrontpageStory
# from myapps.issues.models import PrintIssue

import logging
logger = logging.getLogger('universitas')


class StoryType(models.Model):

    """ A type of story in the publication. """

    name = models.CharField(unique=True, max_length=50)
    section = models.ForeignKey('Section')
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

    XTAG_FORMAT = '@%s:%s'
    XTAG_REGEXP = re.compile(r'^@([^ :]+): ?(.*)$')
    DEFAULT_TAG = 'txt'
    SPLIT_HERE = '¦\n'

    class Meta:
        abstract = True
        verbose_name = _('text content')
        # app_label = 'stories'

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

    def append(self, tag, content, modelfield=None):
        """ Appends content(string) to a modelfield """
        modelfield = modelfield or 'bodytext_markup'
        if modelfield != 'bodytext_markup':
            tag = ''
        try:
            content = '{}\n{}{}'.format(getattr(self, modelfield), tag, content).strip()
            setattr(self, modelfield, content)
            return self
        except (AttributeError, FieldDoesNotExist,) as e:
            self.parent_story.append(tag, content, modelfield)

    def new(self, *args, **kwargs):
        # pass it up.
        return self.parent_story.new(*args, **kwargs)

    def drop(self, *args, **kwargs):
        # do nothing
        pass

    def get_html(self):
        return mark_safe(self.bodytext_html)

    def save(self, *args, **kwargs):
        try:
            saved_markup = type(self).objects.get(pk=self.pk).bodytext_markup
        except ObjectDoesNotExist:
            super().save(*args, **kwargs)
            saved_markup = ''
        if saved_markup != self.bodytext_markup:
            self.clean_markup()
            self.make_html()
        super().save(*args, **kwargs)

    def clean_markup(self):
        bodytext = []
        for paragraph in self.bodytext_markup.splitlines():
            paragraph = Alias.objects.replace(content=paragraph, timing=1)
            bodytext.append(paragraph)
        self.bodytext_markup = '\n'.join(bodytext)

    def parse_markup(self):
        paragraphs = self.bodytext_markup.splitlines()
        self.bodytext_markup = ''

        target = self
        for paragraph in paragraphs:
            blocktag = BlockTag.objects.match_or_create(paragraph)
            tag, content = blocktag.split(paragraph)
            function_name, field = blocktag.action.split(':')
            action = getattr(target, function_name)
            new_target = action(tag, content, field) or target
            if new_target != target != self:
                target.save()
            target = new_target

        if target != self:
            target.save()

    def make_html(self):
        self.bodytext_html = ''
        html = []
        paragraphs = self.bodytext_markup.splitlines()
        for paragraph in paragraphs:
            paragraph = BlockTag.objects.make_html(paragraph)
            paragraph = InlineTag.objects.make_html(paragraph)
            html.append(paragraph)
        self.bodytext_html = '\n'.join(html)


class PublishedStoryManager(models.Manager):

    def published(self):
        now = timezone.now()
        return super().get_queryset().filter(status=Story.STATUS_PUBLISHED).filter(publication_date__lt=now)


class Story(TextContent):

    """ An article or story in the newspaper. """

    class Meta:
        verbose_name = _('Story')
        verbose_name_plural = _('Stories')

    objects = PublishedStoryManager()

    # TODO make this importable?
    STATUS_DRAFT = 0
    STATUS_EDITOR = 5
    STATUS_READY = 9
    STATUS_PUBLISHED = 10
    STATUS_PRIVATE = 15
    STATUS_CHOICES = [
        (STATUS_DRAFT, _('Draft')),
        (STATUS_EDITOR, _('Ready to edit')),
        (STATUS_READY, _('Ready to publish on website')),
        (STATUS_PUBLISHED, _('Published on website')),
        (STATUS_PRIVATE, _('Will not be published')),
    ]
    prodsak_id = models.PositiveIntegerField(
        blank=True, null=True, editable=False,
        help_text=_('Id in the prodsys database.'),
        verbose_name=_('prodsak id')
    )
    title = models.CharField(
        max_length=1000,
        help_text=_('Headline'),
        verbose_name=_('title'),
    )
    kicker = models.CharField(
        blank=True, max_length=1000,
        help_text=_('Secondary headline'),
        verbose_name=_('kicker'),
    )
    lede = models.TextField(
        blank=True,
        help_text=_('Introduction or summary of the story'),
        verbose_name=_('lede'),
    )
    theme_word = models.CharField(
        blank=True, max_length=100,
        help_text=_('Theme'),
        verbose_name=_('theme word'),
    )
    bylines = models.ManyToManyField(
        Contributor, through='Byline',
        help_text=_('The people who created this content.'),
        verbose_name=_('bylines'),
    )
    story_type = models.ForeignKey(
        StoryType,
        help_text=_('The type of story.'),
        verbose_name=_('article type'),
    )
    publication_date = models.DateTimeField(
        null=True, blank=True,
        help_text=_('When this story will be published on the web.'),
        verbose_name=_('publication date'),
    )
    status = models.IntegerField(
        default=STATUS_DRAFT, choices=STATUS_CHOICES,
        help_text=_('Publication status.'),
        verbose_name=_('status'),
    )
    slug = models.SlugField(
        default='slug-here', editable=False,
        help_text=_('Human readable url.'),
        verbose_name=_('slug'),
    )
    issue = models.ForeignKey(
        'issues.PrintIssue', blank=True, null=True,
        help_text=_('Which issue this story was printed in.'),
        verbose_name=_('issue'),
    )
    page = models.IntegerField(
        blank=True, null=True,
        help_text=_('Which page the story was printed on.'),
        verbose_name=_('page'),
    )
    images = models.ManyToManyField(
        ImageFile, through='StoryImage',
        verbose_name=_('images'),
    )
    hit_count = models.PositiveIntegerField(
        default=0,
        editable=False,
        help_text=_('how many time the article has been viewed'),
        verbose_name=_('views')
    )
    bylines_html = models.TextField(
        default='', editable=False,
        verbose_name=('all bylines as html.'),
    )
    legacy_html_source = models.TextField(
        blank=True, null=True, editable=False,
        verbose_name=('Original html from old web page.'),
    )
    legacy_prodsys_source = models.TextField(
        blank=True, null=True, editable=False,
        verbose_name=('Original text in prodsys.'),
    )

    def increment_hit_count(self):
        self.views += 1
        self.save(update_fields=['hit_count'])

    def __str__(self):
        return '{} {:%Y-%m-%d}'.format(
            self.title, self.publication_date)

    def get_bylines_as_html(self):
        from django.utils import translation
        from django.conf import settings
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
        return self.images.count()

    @property
    def section(self):
        return self.story_type.section

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title).replace('_', '')[:50]
        self.bylines_html = self.get_bylines_as_html()
        super(Story, self).save(*args, **kwargs)

        # if self.frontpagestory_set.count() == 0:
        #     frontpagestory = FrontpageStory(
        #         story=self,
        #     )
        #     frontpagestory.save()

    def get_absolute_url(self):
        from django.core.urlresolvers import reverse
        url = reverse(
            viewname='article',
            kwargs={
                'story_id': str(self.id),
                'section': self.section.slug,
                'slug': self.slug,
            },)
        return url

    def new(self, tag, content, element):
        """ Add a story element """
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
            new_element = Aside(
                parent_story=self,
            )
            return new_element.append(tag, content)

        elif element == "pullquote":
            new_element = Pullquote(
                parent_story=self,
            )
            return new_element.append(tag, content)

    def clean_markup(self, *args, **kwargs):
        super().clean_markup(*args, **kwargs)
        self.parse_markup()

    @classmethod
    def populate_frontpage(cls):
        FrontpageStory.objects.all().delete()
        # TODO: Funker bare for 2014
        new_stories = cls.objects.filter(publication_date__year=2014).order_by('publication_date')
        for story in new_stories:
            story.save()


class StoryElement(models.Model):

    """ Models that are placed somewhere inside an article """

    MAXPOSITION = 10000
    parent_story = models.ForeignKey('Story')
    published = models.BooleanField(
        help_text=_('Choose whether this element is published'),
        default=True)
    position = models.PositiveSmallIntegerField(
        default=0,
        validators=[
            MaxValueValidator(MAXPOSITION),
            MinValueValidator(0)],
        help_text=_(
            'Where in the story does this belong? {start} = At the very beginning, {end} = At the end.'.format(
                start=0,
                end=MAXPOSITION)))

    class Meta:
        abstract = True
        # app_label = 'stories'


class Pullquote(TextContent, StoryElement):

    """ A quote that is that is pulled out of the content. """

    class Meta(StoryElement.Meta):
        verbose_name = _('Pullquote')
        verbose_name_plural = _('Pullquotes')

    def find_pullquote_in_bodytext(self):
        """ Looks for the first paragraph in the parent story that matches pullquote content."""
        # remove irrelevant characters from pullquote to make search term.
        needle = re.sub(
            '@\S+:|«|»',
            '',
            self.bodytext_markup.splitlines()[0][:30].lower().strip(),
        )
        paragraphs = self.parent_story.bodytext_markup.lower().splitlines()
        bottom = len(paragraphs) or 1
        for depth, haystack in enumerate(paragraphs):
            if needle in haystack:
                # found matching text.
                break
        else:
            # no matching text. Pullqoute at top.
            depth = 0

        return int(self.MAXPOSITION * depth / bottom)

    def place_pullquote(self):
        """ Places the pullquote with the relevant paragraph. """
        self.position = self.find_pullquote_in_bodytext()
        self.save()


class Aside(TextContent, StoryElement):

    """ Fact box or other information typically placed in side bar """

    class Meta(StoryElement.Meta):
        verbose_name = _('Aside')
        verbose_name_plural = _('Asides')


class StoryMedia(StoryElement):

    """ Video, photo or illustration connected to a story """

    class Meta(StoryElement.Meta):
        abstract = True

    caption = models.CharField(
        help_text=_('Text explaining the media.'),
        blank=True,
        max_length=1000)

    creditline = models.CharField(
        help_text=_('Extra information about media attribution and license.'),
        blank=True,
        max_length=100)

    size = models.PositiveSmallIntegerField(
        help_text=_('relative image size.'),
        default=1,
    )


class StoryImage(StoryMedia):

    """ Photo or illustration connected to a story """

    class Meta(StoryElement.Meta):
        verbose_name = _('Image')
        verbose_name_plural = _('Images')

    imagefile = models.ForeignKey(ImageFile)


class StoryVideo(StoryMedia):

    """ Video content connected to a story """

    class Meta(StoryElement.Meta):
        verbose_name = _('Video')
        verbose_name_plural = _('Videos')

    vimeo_id = models.PositiveIntegerField(
        verbose_name=_('vimeo id number'),
        help_text=_('The number at the end of the url for this video at vimeo.com'),
    )


class Section(models.Model):

    """
    A Section in the publication containing one kind of content.
    """

    class Meta:
        verbose_name = _('Section')
        verbose_name_plural = _('Sections')

    title = models.CharField(
        help_text=_('Section title'),
        unique=True,
        max_length=50
    )

    def __str__(self):
        return self.title

    @property
    def slug(self):
        return slugify(self.title)

    @models.permalink
    def get_absolute_url(self):
        return ('')


class Byline(models.Model):

    """ Credits the people who created content for a story. """

    CREDIT_CHOICES = [
        ('t', _('Text',)),
        ('pf', _('Photo')),
        ('i', _('Illustration')),
        ('g', _('Graphics')),
    ]
    DEFAULT_CREDIT = CREDIT_CHOICES[0][0]
    story = models.ForeignKey(Story)
    contributor = models.ForeignKey(Contributor)
    credit = models.CharField(choices=CREDIT_CHOICES, default=DEFAULT_CREDIT, max_length=20)
    title = models.CharField(blank=True, null=True, max_length=200)

    class Meta:
        # order_with_respect_to = 'story'
        # Denne ser ikke til å være særlig nyttig - ingen ui i admin og dårlig migration.
        verbose_name = _('Byline')
        verbose_name_plural = _('Bylines')

    def __str__(self):
        return '%s: %s (%s)' % (self.get_credit_display(), self.contributor, self.story, )

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
            r'^(?P<credit>[^:, ]+): (?P<full_name>[^,]+)\s*(, (?P<title>.+))?$'
        )

        match = byline_pattern.match(full_byline)
        try:
            d = match.groupdict()
            full_name = d['full_name'].title()
            title = d['title'] or ''
            credit = d['credit'].lower()
            initials = ''.join(letters[0] for letters in full_name.replace('-', ' ').split())
            assert initials == initials.upper()

        except (AssertionError, AttributeError, ) as e:
            # Malformed byline
            logger.warning('Malformed byline: {} {}'.format(full_byline, e))
            full_name, title, initials, credit = 'Nomen Nescio', full_byline, 'XX', 'x'

        for choice in cls.CREDIT_CHOICES:

            if credit[0] in choice[0]:
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


def clean_up_bylines(bylines):
    """
    clean_up_bylines(string) -> string
    Normalise misformatting and idiosyncraticies of bylines in legacy data.
    """

    replacements = (
        # Symbols used to separate individual bylines.
        (r'\r|;|•|\*|·|/', r'\n', re.I),

        # No full stops
        (r'\.', r' ', re.I),

        # A word that ends with colon must be at the beginning of a line.
        (r' +(\S*?:)', r'\n\1', 0),

        # comma, and or "og" before two capitalised words probably means it's a new person. Insert newline.
        (r'\s*(,\s|\s[oO]g\s|\s[aA]nd\s)\s*([A-ZÆØÅ][a-zæøå]+ [A-ZÆØÅ])', r'\n\2', 0),

        # words in parantheses at end of line is probably some creditation. Put in front with colon instead.
        (r'^(.*?) *\(([^)]*)\) *$', r'\2: \1', re.M),

        # "Anmeldt av" is text credit.
        (r'anmeldt av:?', 'text: ', re.I),

        # Any word containging "photo" is some kind of photo credit.
        (r'\S*(ph|f)oto\S*?[\s:]*', '\nfoto: ', re.I),

        # Any word containing "text" is text credit.
        (r'\S*te(ks|x)t\S*?[\s:]*', '\ntekst: ', re.I),

        # These words are stripped from end of line.
        (r' *(,| og| and) *$', '', re.M + re.I),

        # These words are stripped from start of line
        (r'^ *(,|og |and |av ) *', '', re.M + re.I),

        # These words are stripped from after colon
        (r': *(,|og |and |av ) *', ':', re.M + re.I),

        # Creditline with empty space after it is deleted.
        (r'^\S:\s*$', '', re.M),

        # Remove lines containing only whitespace.
        (r'\s*\n\s*', r'\n', 0),

        # Bylines with no credit are assumed to be text credit.
        (r'^([^:]+?)$', r'tekst:\1', re.M),

        # Exactly one space after and no space before colon or comma.
        (r'\s*([:,])+\s*', r'\1 ', 0),
    )
    for pattern, replacement, flags in replacements:
        bylines = re.sub(pattern, replacement, bylines, flags=flags)
    bylines = bylines.strip()
    return bylines
