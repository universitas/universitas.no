# -*- coding: utf-8 -*-
""" Content in the publication. """
from django.db import models
from django.utils.translation import ugettext_lazy as _
# from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
import re
from prodsys_import.prodsys import Prodsys


class Story(models.Model):

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
    prodsys_id = models.PositiveIntegerField(
        help_text=_('Id in the prodsys database.')
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
    prodsys_json = models.TextField(
        blank=True,
        help_text=_('Json imported from prodsys'),
        editable=False,
    )
    bodytext_markup = models.TextField(
        blank=True,
        default=_('Write your story here.'),
        help_text=_('The content of the story. Marked up.'),
    )
    bodytext_html = models.TextField(
        blank=True,
        editable=False,
        default='<p>Placeholder</p>',
        help_text=_('The content of the story. Formatted in simple HTML'),
    )
    bylines = models.ManyToManyField(
        'Contributor', through='Byline',
        help_text=_('The people who created this content.')
    )
    story_type = models.ForeignKey(
        'StoryType',
        help_text=_('The type of story.')
    )
    dateline_place = models.CharField(
        blank=True, max_length=50,
        help_text=_('Where this story happened.')
    )
    dateline_date = models.DateField(
        blank=True, null=True,
        help_text=_('When this story happened.')
    )
    publication_date = models.DateTimeField(
        null=True, blank=True,
        help_text=_('When this story will be published on the web.')
    )
    status = models.IntegerField(
        default=0, choices=STATUS_CHOICES,
        help_text=_('Publication status.'),
    )
    slug = models.SlugField(
        default='slug-here',
        help_text=_('Human readable url.'),
        editable=False,
    )
    issue = models.ForeignKey(
        "PrintIssue",
        blank=True, null=True,
        help_text=_('Which issue this story was printed in.'),
    )
    page = models.IntegerField(
        blank=True, null=True,
        help_text=_('Which page the story was printed on.'),
    )
    pdf_url = models.URLField(
        blank=True, null=True,
        help_text=_('URL to the story in pdf.')
    )  # TODO create function
    related_stories = models.ManyToManyField(
        'self',
        help_text=_('Stories with related content.')
    )
    # TODO: Implement Extras and Revisions.
    # Extras
    #     related model
    # Revisions
    #     ?

    class Meta:
        verbose_name = _('Story')
        verbose_name_plural = _('Stories')

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)[:50]
        if self.pk is not None:
            orig = Story.objects.get(pk=self.pk)
            if orig.bodytext_markup != self.bodytext_markup:
                self.createHtml()
        else:
            self.createHtml()
        super(Story, self).save(*args, **kwargs)

    def createHtml(self):
        # TODO: creatHTML model method in story is a hack.
        html = self.bodytext_html or 'not implemented'
        self.bodytext_html = html

    @models.permalink
    def get_absolute_url(self):
        return "http://change_this_method/%s/%s/" % (self.pk, self.slug)

    def clean_markup(self):
        """ Cleans up markup and populates model fields based on current xtags. """

        def check_tag(tag, paragraph_text, bucket):
            if tag == "headline":
                buckets["headlines"].append(paragraph_text)
                return bucket

            elif tag == "ing":
                buckets["ledes"].append(paragraph_text)
                return bucket

            elif tag == "stikktit":
                buckets["kickers"].append(paragraph_text)
                return bucket

            elif tag == "bl":
                bylines = re.sub(r'[;•]', r'\n', paragraph_text).splitlines()
                buckets["bylines"] += bylines
                return bucket

            elif tag == "sitat":
                bucket = []
                buckets["pullquotes"].append(bucket)

            elif tag == "sitatbyline":
                bucket.append(tag + paragraph_text)
                bucket = buckets["body"]

            elif tag == "fakta":
                bucket = []
                buckets["asides"].append(bucket)

            bucket.append("@%s:%s" % (tag, paragraph_text))
            return bucket

        buckets = {
            "headlines": [],
            "kickers": [],
            "ledes": [],
            "bylines": [],
            "body": [],
            "pullquotes": [],
            "asides": [],
        }
        active_bucket = buckets["body"]
        current_tag = "txt"
        xtag_regexp = re.compile(r'^@([^ :]+): ?(.*)$')
        input_markup = self.bodytext_markup.splitlines()

        for paragraph in input_markup:
            starts_with_tag = xtag_regexp.match(paragraph)
            if starts_with_tag:
                current_tag = starts_with_tag.group(1)
                paragraph_text = starts_with_tag.group(2)
            else:
                paragraph_text = paragraph
            active_bucket = check_tag(current_tag, paragraph_text, active_bucket)

        self.title = '\n'.join(buckets["headlines"]) or self.title
        self.kicker = '\n'.join(buckets["kickers"]) or self.kicker
        self.lede = '\n'.join(buckets["ledes"]) or self.lede
        self.bodytext_markup = '\n'.join(buckets["body"])
        self.bodytext_html = self.wrapInHTML()
        self.save()
        for byline in buckets["bylines"]:
            Byline.create(
                story=self,
                full_byline=byline,
                initials='',
                )

        for pullquote in buckets["pullquotes"]:
            # Pullquote.create()
            # raise NotImplementedError
            # TODO: implement pullquote and aside creation.
            pass

        for asides in buckets["asides"]:
            # Aside.create()
            # raise NotImplementedError
            pass


    def wrapInHTML(self):
        """ Return HTML representation of body text """
        html = []
        xtag_regexp = re.compile(r'^@([^ :]+): ?(.*)$') # TODO: Put tag-related constants in Prodsystag class.

        for paragraph in self.bodytext_markup.splitlines():
            tag, text = xtag_regexp.match(paragraph).groups()
            html.append(
                ProdsysTag.wrap_text(tag, text)
            )
        return '\n'.join(html)


class StoryType(models.Model):

    """ A type of story in the publication. """

    name = models.CharField(unique=True, max_length=50)
    section = models.ForeignKey('Section')
    template = models.ForeignKey('Story', blank=True, null=True)
    prodsys_mappe = models.CharField(max_length=100)

    class Meta:
        verbose_name = _('StoryType')
        verbose_name_plural = _('StoryTypes')

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

    def __str__(self):
        return self.title

    @models.permalink
    def get_absolute_url(self):
        return ('')


class StoryChild(models.Model):

    """ Asides and other content related to an Story. """

    # Define fields here
    story = models.ForeignKey(Story)
    content = models.TextField()
    ordering = models.PositiveSmallIntegerField(default=1)
    position = models.PositiveSmallIntegerField(default=1)
    published = models.NullBooleanField(default=True)

    class Meta:
        verbose_name = _('StoryChild')
        verbose_name_plural = _('StoryChildren')
        unique_together = ('story', 'ordering', 'position')
        # TODO: sjekk at unique_together i StoryChild funker riktig

    def __str__(self):
        pass

    # def save(self):
    #     pass
    # TODO: sørge for at unique blir håndhevet

    @models.permalink
    def get_absolute_url(self):
        return ('')

    # Define custom methods here


class Byline(models.Model):

    """ The person who created content for an story. """

    CREDIT_CHOICES = [
        ('text', _('Text',)),
        ('photo', _('Photo')),
        ('illustration', _('Illustration')),
        ('graphics', _('Graphics')),
    ]
    story = models.ForeignKey('Story')
    contributor = models.ForeignKey('Contributor')
    credit = models.CharField(choices=CREDIT_CHOICES, default=CREDIT_CHOICES[0], max_length=20)
    title = models.CharField(blank=True, max_length=200)

    class Meta:
        verbose_name = _('Byline')
        verbose_name_plural = _('Bylines')

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
        d = byline_pattern.match(full_byline).groupdict()
        full_name = d['full_name']
        title = d['title']
        credit = d['credit']
        if not credit in (choice for choice, label in cls.CREDIT_CHOICES):
            credit = None

        contributor = Contributor.get_or_create(full_name, initials)

        new_byline = cls(
            story=story,
            credit=credit,
            title=title,
            contributor=contributor,
        )

        return new_byline


# class Temaord(models.Model):
    # TODO: Define fi# Temaord?
    # Title
    #     string
    # CSS
    #     text/css
    # vignette?
    #     text/htmlelds here

    # class Meta:
    #     verbose_name = _('Temaord')
    #     verbose_name_plural = _('Temaords')

    # def __str__(self):
    #     pass

    # def save(self):
    #     pass

    # @models.permalink
    # def get_absolute_url(self):
    #     return ('')

    # Define custom methods here


class Contributor(models.Model):

    """ Someone who contributes content to the newspaper or other staff. """

    # TODO: Move to different app
    # TODO: Implement foreignkeys to positions, user and contact_info
    # user = models.ForeignKey(User, blank=True, null=True)
    # position = models.ForeignKey('Position')
    # contact_info = models.ForeignKey('ContactInfo')
    displayName = models.CharField(blank=True, max_length=50)
    aliases = models.TextField(blank=True)
    initials = models.CharField(blank=True, null=True, max_length=5)

    class Meta:
        verbose_name = _('Contributor')
        verbose_name_plural = _('Contributors')

    def __str__(self):
        return self.displayName or self.initials or 'N. N.'

    @classmethod
    def get_or_create(cls, full_name, initials=''):
        """
        Fancy lookup for low quality legacy imports.
        Tries to avoid creation of multiple contributor instances
        for a single real contributor.
        """
        names = full_name.split()
        last_name = names[-1]
        first_name = names[:-1][0]
        # middle_name = ' '.join(names[1:-1])

        base_query = cls.objects

        def find_single_item_or_none(func):
            """ Decorator to return one item or none """

            def inner_func(*args, **kwargs):
                try:
                    return func(*args, **kwargs)
                except ObjectDoesNotExist:
                    # lets' try something else.
                    return None
                except MultipleObjectsReturned:
                    # We pass this error on for now.
                    # TODO: Make sure two people can have the same name.
                    raise
            return inner_func

        @find_single_item_or_none
        def search_for_full_name():
            return base_query.get(displayName=full_name)

        @find_single_item_or_none
        def search_for_first_plus_last_name():
            if not first_name:
                return None
            return base_query.get(
                displayName__istartswith=first_name,
                displayName__iendswith=last_name)

        @find_single_item_or_none
        def search_for_alias():
            if first_name:
                return None
            return base_query.get(alias__icontains=last_name)

        @find_single_item_or_none
        def search_for_initials():
            if first_name or not initials:
                return None
            contributor = base_query.get(initials__iexact=initials)
            contributor.aliases += full_name
            contributor.save()
            return contributor

        # Variuous queries to look for contributor in the database.
        contributor = (
            search_for_full_name() or
            search_for_alias() or
            search_for_initials() or
            None
        )

        # Was not found with any of the methods.
        if not contributor:
            contributor = cls(
                displayName=full_name,
                initials=initials,
            )
            contributor.save()
        return contributor


class ContactInfo(models.Model):

    """
    Contact information for contributors and others.
    """

    PERSON = _('Person')
    INSTITUTION = _('Institution')
    POSITION = _('Position')
    CONTACT_TYPES = (
        ("Person", PERSON),
        ("Institution", INSTITUTION),
        ("Position", POSITION),
    )

    name = models.CharField(blank=True, null=True, max_length=200)
    title = models.CharField(blank=True, null=True, max_length=200)
    phone = models.CharField(blank=True, null=True, max_length=20)
    email = models.EmailField(blank=True, null=True)
    postal_address = models.CharField(blank=True, null=True, max_length=200)
    street_address = models.CharField(blank=True, null=True, max_length=200)
    webpage = models.URLField()
    contact_type = models.CharField(choices=CONTACT_TYPES, max_length=50)

    class Meta:
        verbose_name = _('ContactInfo')
        verbose_name_plural = _('ContactInfos')

    def __str__(self):
        return self.name


class Position(models.Model):

    """ A postion og job in the publication. """

    title = models.CharField(
        help_text=_('Job title at the publication.'),
        unique=True, max_length=50)

    class Meta:
        verbose_name = _('Position')
        verbose_name_plural = _('Positions')

    def __str__(self):
        pass

    def save(self):
        pass

    @models.permalink
    def get_absolute_url(self):
        return ('')

    # TODO: Defne custom methods here


class PrintIssue(models.Model):

    """ An printed issue of the publication. """

    issue_number = models.CharField(max_length=5)
    publication_date = models.DateField()
    pages = models.IntegerField(help_text='Number of pages')
    pdf = models.FilePathField(
        help_text=_('Pdf file for this issue.'),
        blank=True, null=True,)
    cover_page = models.FilePathField(
        help_text=_('An image file of the front page'),
        blank=True, null=True,)

    class Meta:
        verbose_name = _('Issue')
        verbose_name_plural = _('Issues')

    def __str__(self):
        return self.issue_number

    # TODO: File path and image should be refactored to be a function.
    @models.permalink
    def get_absolute_url(self):
        return ('')


class ProdsysTag(models.Model):

    """ Tag from prodsys """

    xtag = models.CharField(default='@tagname:', unique=True, max_length=50)
    html_tag = models.CharField(default='p', max_length=50)
    html_class = models.CharField(blank=True, null=True, max_length=50)

    class Meta:
        verbose_name = _('prodsys_tag')
        verbose_name_plural = _('prodsys_tags')

    def __str__(self):
        """ unicode  """
        return self.xtag

    def save(self, *args, **kwargs):
        if not self.pk and not self.html_class:
            self.html_class = self.xtag
        super(ProdsysTag, self).save(*args, **kwargs)

    def wrap(self, content):
        """ Wrap string in html for this tag """
        if self.html_class is None:
            html = '<%s>%s</%s>' % (self.html_tag, content, self.html_tag)
        else:
            html = '<%s class="%s">%s</%s>' % (self.html_tag, self.html_class, content, self.html_tag)
        return html

    @classmethod
    def wrap_text(cls, xtag, content):
        """ Wrap text in html tags even if tag does not exist yet. """
        # TODO: Prodsystag.wrap_text() bør gjøres i en utilityfunksjon som ikke misbruker databasen så mye.

        tag = ProdsysTag.objects.get_or_create(xtag=xtag)[0]
        return tag.wrap(content)


def import_from_prodsys(items, overwrite=False):
    """
    Imports one or more articles from prodsys.
    args:
        item: int or list of ints of prodsys_id
        overwrite: boolean overwrite if item already exists.

    returns:
        Artice or list of Articles
    """
    prodsys = Prodsys()

    def import_single_article(item):
        """ Imports single item """

        new_item = prodsys.fetch_article_from_prodsyst(item)

        story_type = StoryType.objects.filter(
            prodsys_mappe=new_item["mappe"],)
        if not story_type:
            story_type = StoryType.objects.last()
        else:
            # Use first one if several story_types maps to the same.
            story_type = story_type[0]


    def import_single_image(dict):
        """ Imports single image """
        pass

    if isinstance(items, list):
        for item in items:
            import_single_article(item)
    else:
        assert isinstance(items, int)
        item = items
        import_single_article(item)
