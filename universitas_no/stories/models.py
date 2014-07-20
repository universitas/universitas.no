# -*- coding: utf-8 -*-
""" Content in the publication. """
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
# from .prodsys import Prodsys, wrapInHTML

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
        help_text=_('The title of the story.')
    )
    lede = models.TextField(
        blank=True,
        help_text=_('Summary of the story.')
    )
    prodsys_json = models.TextField(
        help_text=_('Json imported from prodsys'),
        blank=True,
    )
    bodytext_markup = models.TextField(
        blank=True,
        help_text=_('The content of the story. Marked up.'),)
    bodytext_html = models.TextField(
        default='<p>Placeholder</p>',
        help_text=_('The content of the story. Formatted in simple HTML'),
        blank=True,
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
        help_text=_('Publication status.')
    )
    theme_word = models.CharField(
        # TODO: Make into model?
        max_length=50,
        help_text=_('Theme')
    )
    slug = models.SlugField(
        default='slug-here',
        help_text=_('Human readable url.'),
        editable=False
    )
    issue = models.ForeignKey(
        "PrintIssue", blank=True, null=True,
        help_text=_('Which issue this story was printed in.')
    )
    page = models.IntegerField(
        blank=True, null=True,
        help_text=_('Which page the story was printed on.')
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
        # TODO: this is a hack.
        html = self.bodytext_html or 'not implemented'
        self.bodytext_html = html

    @models.permalink
    def get_absolute_url(self):
        return "http://change_this_method/%s/%s/" % (self.pk, self.slug)

    # Define custom methods here


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
    # TODO: sjekk om dette funker riktig

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
    credit = models.CharField(choices=CREDIT_CHOICES, max_length=20)

    class Meta:
        verbose_name = _('Byline')
        verbose_name_plural = _('Bylines')

    def __str__(self):
        return '%s: %s' % (self.credit, self.contributor)

    # TODO: Define custom methods here


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
    user = models.ForeignKey(User, blank=True, null=True)
    displayName = models.CharField(blank=True, null=True, max_length=50)
    position = models.ForeignKey('Position')
    contact_info = models.ForeignKey('ContactInfo')

    class Meta:
        verbose_name = _('Contributor')
        verbose_name_plural = _('Contributors')

    def __str__(self):
        pass

    def save(self):
        pass

    @models.permalink
    def get_absolute_url(self):
        return ('')

    # Define custom methods here


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
        pass

    def save(self):
        pass

    @models.permalink
    def get_absolute_url(self):
        return ('')

    # TODO: Defne custom methods here


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
    pages = models.IntegerField(help_text='Number of pages')
    # TODO: Function? or Filepathfield
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
        pass

    def save(self):
        pass

    @models.permalink
    def get_absolute_url(self):
        return ('')

    # Define custom methods here


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
        # TODO: Dette bør gjøres i en utilityfunksjon som ikke misbruker databasen så mye.
        tag = ProdsysTag.objects.get_or_create(xtag=xtag)[0]
        return tag.wrap(content)
