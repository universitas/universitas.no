# -*- coding: utf-8 -*-
""" Content in the publication. """

# Python standard library
import re
import html
from collections import defaultdict

# Django core
from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.template.defaultfilters import slugify
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.safestring import mark_safe

# Installed apps
from model_utils.models import TimeStampedModel

# Project apps
from apps.prodsys_api_access.prodsys import Prodsys
from apps.contributors.models import Contributor
from apps.issues.models import PrintIssue


class TextContent(TimeStampedModel):

    XTAG_FORMAT = '@%s:%s'
    XTAG_REGEXP = re.compile(r'^@([^ :]+): ?(.*)$')
    DEFAULT_TAG = 'txt'
    SPLIT_HERE = '\n*** SPLIT HERE ***\n'

    bodytext_markup = models.TextField(
        blank=True,
        default=_('Write your content here.'),
        help_text=_('Content with xtags markup.'),
    )

    bodytext_html = models.TextField(
        blank=True,
        editable=False,
        default='<p>Placeholder</p>',
        help_text=_('HTML tagged content'),
    )

    def get_html(self):
        return mark_safe(self.bodytext_html)

    class Meta:
        abstract = True
        app_label = 'stories'

    def save(self, *args, **kwargs):

        try:
            original = Story.objects.get(pk=self.pk)
            if original.bodytext_markup != self.bodytext_markup:
                self.clean_markup()
        except ObjectDoesNotExist:
            # new story
            super(TextContent, self).save(*args, **kwargs)
            self.clean_markup()

        super(TextContent, self).save(*args, **kwargs)

    def sort_paragraphs_by_tag(self, tag, paragraph_text):
        """ Magical sorting hat that puts each paragraph into the relevant bucket before saving or generating html. """

        # The bucket that the current paragraph will be put into.
        bucket = self.bucket

        if not paragraph_text:
            # empty paragraphs goes into the trashcan.
            bucket = []

        elif tag in ('headline', 'ing', 'stikktit', 'temaord', 'bl', 'sitat', 'fakta'):
            # special self.buckets used to populate modelfields in main story.
            bucket = self.buckets[tag]
            if tag == 'bl':
                # split individual bylines with linebreak.
                paragraph_text = re.sub(r'[\r\n;•]| og ', self.SPLIT_HERE, paragraph_text)

            if tag in ('sitat', 'fakta',):
                # start new aside or pullquote and collect next paragraphs in the same bucket
                self.bucket = bucket
                if bucket:
                    # Not the first pullquote or aside.
                    bucket.append(self.SPLIT_HERE)
            else:
                # paragraphs in these buckets don't need the tags anymore.
                tag = None

        elif tag in ('sitatbyline', 'kilde',):
            # finishes aside or pullquote
            self.bucket = self.buckets[self.DEFAULT_TAG]

        elif tag in ('txt', 'mt'):
            # just to be sure that these always are in the default bucket, if someone does't close a pullquote properly.
            bucket = self.bucket = self.buckets[self.DEFAULT_TAG]

        if tag:
            # add tag back.
            paragraph_text = self.XTAG_FORMAT % (tag, paragraph_text)

        bucket.append(paragraph_text)

    def clean_markup(self):
        """ Cleans up markup and populates model fields based on current xtags. """

        self.buckets = defaultdict(list)
        self.bucket = self.buckets[self.DEFAULT_TAG]

        input_markup = self.bodytext_markup.splitlines()
        self.tag = self.DEFAULT_TAG

        # Find correct tag for each paragraph and sort them into body text or other bucket.
        for paragraph in input_markup:
            paragraph = paragraph.strip()
            starts_with_tag = self.XTAG_REGEXP.match(paragraph)
            if starts_with_tag:
                self.tag, text = starts_with_tag.groups()
            else:  # same tag as last paragraph
                text = paragraph
            self.sort_paragraphs_by_tag(self.tag, text)

        # joins text strings in all the self.buckets
        for key in self.buckets:
            self.buckets[key] = '\n'.join(self.buckets[key])
            # print('\n%s:\n%s' % (key, self.buckets[key][:100]))
            # print('\n%s:\n%s' % (key, len(self.buckets[key])))

        self.bodytext_markup = self.buckets[self.DEFAULT_TAG]
        self.bodytext_html = self.wrapInHTML()

    def wrapInHTML(self):
        """ Return HTML representation of body text """
        html = []
        for paragraph in self.bodytext_markup.splitlines():
            tag, text = self.XTAG_REGEXP.match(paragraph).groups()
            html.append(ProdsysTag.wrap_text(tag, text))
        html_bodytext = '\n'.join(html)
        return html_bodytext


class Story(TextContent):

    """ An article or story in the newspaper. """

    # TODO make this importable?
    STATUS_DRAFT = 0
    STATUS_UNPUBLISHED = 5
    STATUS_PUBLISHED = 10
    STATUS_CHOICES = [
        (STATUS_DRAFT, _("Draft")),
        (STATUS_UNPUBLISHED, _("Unpublished")),
        (STATUS_PUBLISHED, _("Published")),
    ]
    prodsak_id = models.PositiveIntegerField(
        help_text=_('Id in the prodsys database.'),
        blank=True, null=True,
    )
    title = models.CharField(
        max_length=1000,
        help_text=_('Headline')
    )
    kicker = models.CharField(
        blank=True,
        max_length=1000,
        help_text=_('Secondary headline')
    )
    lede = models.TextField(
        blank=True,
        help_text=_('Introduction or summary of the story')
    )
    theme_word = models.CharField(
        blank=True,
        max_length=100,
        help_text=_('Theme')
    )
    bylines = models.ManyToManyField(
        Contributor, through='Byline',
        help_text=_('The people who created this content.')
    )
    story_type = models.ForeignKey(
        'StoryType',
        help_text=_('The type of story.')
    )
    publication_date = models.DateTimeField(
        null=True, blank=True,
        help_text=_('When this story will be published on the web.')
    )
    status = models.IntegerField(
        default=STATUS_DRAFT, choices=STATUS_CHOICES,
        help_text=_('Publication status.'),
    )
    slug = models.SlugField(
        default='slug-here',
        help_text=_('Human readable url.'),
        editable=False,
    )
    issue = models.ForeignKey(
        PrintIssue,
        blank=True, null=True,
        help_text=_('Which issue this story was printed in.'),
    )
    page = models.IntegerField(
        blank=True, null=True,
        help_text=_('Which page the story was printed on.'),
    )
    # dateline_place = models.CharField(
    #     blank=True, max_length=50,
    #     help_text=_('Where this story happened.')
    # )
    # dateline_date = models.DateField(
    #     blank=True, null=True,
    #     help_text=_('When this story happened.')
    # )
    # pdf_url = models.URLField(
    #     blank=True, null=True,
    #     help_text=_('URL to the story in pdf.')
    # )  # TODO create function
    # related_stories = models.ManyToManyField(
    #     'self',
    #     help_text=_('Stories with related content.')
    # )
    # TODO: Revisions.

    class Meta:
        verbose_name = _('Story')
        verbose_name_plural = _('Stories')
        app_label = 'stories'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)[:50]
        super(Story, self).save(*args, **kwargs)

    @models.permalink
    def get_absolute_url(self):
        return "http://change_this_method/%s/%s/" % (self.pk, self.slug)
        # TODO: Make a proper permalink.

    def clean_markup(self, *args, **kwargs):

        super().clean_markup(*args, **kwargs)

        self.title = self.buckets.get("headline", self.title)
        self.kicker = self.buckets.get("stikktit", self.kicker)
        self.lede = self.buckets.get("ing", self.lede)
        self.theme_word = self.buckets.get("temaord", self.theme_word)
        # import ipdb
        # ipdb.set_trace()
        bylines = self.buckets.get("bl", "").split(self.SPLIT_HERE)
        pullquotes = self.buckets.get("sitat", "").split(self.SPLIT_HERE)
        asides = self.buckets.get("fakta", "").split(self.SPLIT_HERE)

        for byline in bylines:
            if byline:
                Byline.create(
                    story=self,
                    full_byline=byline,
                    initials='',  # TODO: send over initials?
                )

        for pullquote in pullquotes:
            if pullquote:
                needle = re.sub('@\S+:|«|»', '', pullquote.splitlines()[0].lower())[:30].strip()
                paragraphs = self.bodytext_markup.splitlines()
                bottom = len(paragraphs) or 1
                for depth, haystack in enumerate(paragraphs):
                    if needle in haystack.lower():
                        # print(needle + '\n'+ haystack)
                        break
                else:
                    depth = 0
                position = int(StoryElementMixin.MAXPOSITION * depth / bottom)
                # print('%s/%s (%s)\n%s\n%s' % (depth, bottom, position, needle, pullquote))

                new_pullquote = Pullquote(
                    parent_story=self,
                    bodytext_markup=pullquote,
                    position=position,
                )
                new_pullquote.save()

        for aside in asides:
            if aside:
                new_aside = Aside(
                    parent_story=self,
                    bodytext_markup=aside,
                    position=0,
                )
                new_aside.save()


class StoryElementMixin(models.Model):

    """ Models that are placed somewhere inside an article """
    MAXPOSITION = 10000
    parent_story = models.ForeignKey('Story')
    published = models.BooleanField(
        help_text=_('Choose whether this element is published'),
        default=True)
    position = models.PositiveSmallIntegerField(
        default=0, validators=[
            MaxValueValidator(MAXPOSITION), MinValueValidator(0)], help_text=_(
            'Where in the story does this belong? %d = At the very beginning, %d = At the end.' %
            (0, MAXPOSITION)))
    class Meta:
        app_label = 'stories'


class Pullquote(TextContent, StoryElementMixin):
    DEFAULT_TAG = 'sitat'

    """ A quote that is that is pulled out of the content. """
    class Meta:
        verbose_name = _('Pullquote')
        verbose_name_plural = _('Pullquotes')
        app_label = 'stories'


class Aside(TextContent, StoryElementMixin):
    DEFAULT_TAG = 'fakta'

    """ Fact box or other information typically placed in side bar """
    class Meta:
        verbose_name = _('Aside')
        verbose_name_plural = _('Asides')
        app_label = 'stories'


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
        app_label = 'stories'

    def __str__(self):
        return self.name

    @models.permalink
    def get_absolute_url(self):
        return ('')


class Section(models.Model):

    """
    A Section in the publication that collects one type of content.
    """

    title = models.CharField(
        help_text=_('Section title'),
        unique=True, max_length=50)

    class Meta:
        verbose_name = _('Section')
        verbose_name_plural = _('Sections')
        app_label = 'stories'

    def __str__(self):
        return self.title + '!'

    @models.permalink
    def get_absolute_url(self):
        return ('')


class Byline(models.Model):

    """ The person who created content for an story. """

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
        verbose_name = _('Byline')
        verbose_name_plural = _('Bylines')
        app_label = 'stories'

    def __str__(self):
        return '%s: %s' % (self.credit, self.contributor)

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
            r'^((?P<credit>[^:,]+):)?\s*(?P<full_name>[^,]+)\s*(,\s*(?P<title>.+))?$'
        )
        full_byline = full_byline.replace('\t', ':')
        match = byline_pattern.match(full_byline)
        d = match.groupdict()
        full_name = d['full_name']
        title = d['title']
        credit_first_letter = (d['credit'] or cls.DEFAULT_CREDIT[0])[0]
        for choice in cls.CREDIT_CHOICES:
            if credit_first_letter in choice[0]:
                credit = choice[0]
                break
        else:
            credit = cls.DEFAULT_CREDIT

        contributor = Contributor.get_or_create(full_name, initials)

        new_byline = cls(
            story=story,
            credit=credit,
            title=title,
            contributor=contributor,
        )
        try:
            new_byline.save()
        except:
            print(credit)

        return new_byline

class ProdsysTag(models.Model):

    """ Tag from prodsys """

    xtag = models.CharField(default='@tagname:', unique=True, max_length=50)
    html_tag = models.CharField(default='p', max_length=50)
    html_class = models.CharField(blank=True, null=True, max_length=50)

    class Meta:
        verbose_name = _('prodsys_tag')
        verbose_name_plural = _('prodsys_tags')
        app_label = 'stories'

    def __str__(self):
        """ unicode  """
        return self.xtag

    def save(self, *args, **kwargs):
        if not self.pk and not self.html_class:
            self.html_class = self.xtag
        super(ProdsysTag, self).save(*args, **kwargs)

    def wrap(self, content):
        """ Wrap string in html for this tag """
        content = html.escape(content)
        if self.html_class is None:
            block = '<%s>%s</%s>' % (self.html_tag, content, self.html_tag)
        else:
            block = '<%s class="%s">%s</%s>' % (self.html_tag, self.html_class, content, self.html_tag)
        return block

    @classmethod
    def wrap_text(cls, xtag, content):
        """ Wrap text in html tags even if tag does not exist yet. """
        # TODO: Prodsystag.wrap_text() bør gjøres i en utilityfunksjon som ikke misbruker databasen så mye.

        tag = ProdsysTag.objects.get_or_create(xtag=xtag)[0]
        return tag.wrap(content)


# def import_from_prodsys(items, overwrite=False):
#     """
#     Imports one or more articles from prodsys.
#     args:
#         item: int or list of ints of prodsys_id
#         overwrite: boolean overwrite if item already exists.

#     returns:
#         Artice or list of Articles
#     """
#     prodsys = Prodsys()

#     def import_single_article(item):
#         """ Imports single item """

#         story_kwargs = prodsys.fetch_article_from_prodsys(item)
#         prodsys_images = story_kwargs.pop('images')
#         prodsys_mappe = story_kwargs.pop('mappe')
#         date = story_kwargs.pop('date')
#         published = story_kwargs.pop('published')
#         try:
#             story_type = StoryType.objects.get(prodsys_mappe=prodsys_mappe)
#         except ObjectDoesNotExist:
#             story_type = StoryType.objects.create(
#                 prodsys_mappe=prodsys_mappe,
#                 name="New Story Type - " + prodsys_mappe,
#                 section=Section.objects.first(),
#             )
#         except MultipleObjectsReturned:
#             # TODO: Det bør egentlig bare være en sakstype
#             story_type = StoryType.objects.filter(prodsys_mappe=prodsys_mappe).first()

#         story_kwargs["dateline_date"] = date
#         if published:
#             story_kwargs["publication_date"] = date
#             story_kwargs["status"] = Story.STATUS_UNPUBLISHED

#         story_kwargs["story_type"] = story_type

#         new_story = Story(**story_kwargs)
#         new_story.save()
#         # print(story_kwargs['prodsys_id'], new_story.title)
#         for image in prodsys_images:
#             print(image)

#         print(new_story.get_html())
#         return new_story

#     def import_single_image(dict):
#         """ Imports single image """
#         pass

#     if isinstance(items, list):
#         for item in items:
#             import_single_article(item)
#     else:
#         assert isinstance(items, int)
#         item = items
#         return import_single_article(item)

