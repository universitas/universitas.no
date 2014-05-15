from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User


class Article(models.Model):
    # TODO: Docstring
    # TODO: help_text
    STATUS_DRAFT = 0
    STATUS_UNPUBLISHED = 5
    STATUS_PUBLISHED = 10
    STATUS_CHOICES = [
        (STATUS_DRAFT, _("Draft")),
        (STATUS_UNPUBLISHED, _("Unpublished")),
        (STATUS_PUBLISHED, _("Published")),
    ]
    title = models.CharField(max_length=1000)
    lede = models.TextField(blank=True)
    slug = models.CharField(max_length=50, unique=True)
    article_type = models.ForeignKey('ArticleType')
    byline = models.ManyToManyField('Contributor', through='Byline')
    dateline_place = models.CharField(blank=True, max_length=50)
    dateline_date = models.DateField(blank=True, null=True)
    publication_date = models.DateTimeField(null=True, blank=True)
    status = models.IntegerField(
        default=0, choices=STATUS_CHOICES)
    theme_word = models.CharField(max_length=50)
    content = models.TextField(blank=True)
    issue = models.ForeignKey("PrintIssue", blank=True, null=True)
    page = models.IntegerField(blank=True, null=True)
    pdf_url = models.URLField(blank=True, null=True)
    related_stories = models.ManyToManyField('self')
    # Extras
    #     related model
    # Revisions
    #     ?

    class Meta:
        verbose_name = _('Article')
        verbose_name_plural = _('Articles')

    def __unicode__(self):
        pass

    def save(self):
        pass

    @models.permalink
    def get_absolute_url(self):
        return ('')

    # TODO: Define custom methods here


class StoryChild(models.Model):
    # TODO: Define fields here
    article = models.ForeignKey(Article)
    content = models.TextField()
    ordering = models.PositiveSmallIntegerField(default=1)
    position = models.PositiveSmallIntegerField(default=1)
    published = models.NullBooleanField(default=True)

    class Meta:
        verbose_name = _('StoryChild')
        verbose_name_plural = _('StoryChildren')
        unique_together = ('article', 'ordering', 'position')
    # TODO: sjekk om dette funker riktig

    def __unicode__(self):
        pass

    # def save(self):
    #     pass
    # TODO: sørge for at unique blir håndhevet

    @models.permalink
    def get_absolute_url(self):
        return ('')

    # TODO: Define custom methods here
    # TODO: sort()


class Byline(models.Model):
    CREDIT_CHOICES = [
        ('text', _('Text',)),
        ('photo', _('Photo')),
        ('illustration', _('Illustration')),
        ('graphics', _('Graphics')),
    ]
    article = models.ForeignKey('Article')
    contributor = models.ForeignKey('Contributor')
    credit = models.CharField(choices=CREDIT_CHOICES, max_length=20)

    class Meta:
        verbose_name = _('Byline')
        verbose_name_plural = _('Bylines')

    def __unicode__(self):
        pass

    # TODO: Define custom methods here


class ArticleType(models.Model):

    name = models.CharField(unique=True, max_length=50)
    section = models.ForeignKey('Section')
    template = models.ForeignKey('Story', blank=True, null=True)

    class Meta:
        verbose_name = _('ArticleType')
        verbose_name_plural = _('ArticleTypes')

    def __unicode__(self):
        pass

    def save(self):
        pass

    @models.permalink
    def get_absolute_url(self):
        return ('')

    # TODO:
        # Define custom methods here


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

    # def __unicode__(self):
    #     pass

    # def save(self):
    #     pass

    # @models.permalink
    # def get_absolute_url(self):
    #     return ('')

    # TODO: Define custom methods here


class Contributor(models.Model):

    # TODO: Move to different app
    user = models.ForeignKey(User, blank=True, null=True)
    displayName = models.CharField(blank=True, null=True, max_length=50)
    position = models.ForeignKey('Position')
    contact_info = models.ForeignKey('ContactInfo')

    class Meta:
        verbose_name = _('Contributor')
        verbose_name_plural = _('Contributors')

    def __unicode__(self):
        pass

    def save(self):
        pass

    @models.permalink
    def get_absolute_url(self):
        return ('')

    # TODO: Define custom methods here


class PrintIssue(models.Model):
    # TODO: egen PDF-app

    issue_number = models.CharField(max_length=5)
    pages = models.IntegerField(help_text='Number of pages')
    # TODO: Function? or Filepathfield
    pdf = models.FileField(blank=True, null=True)
    frontpage = models.FileField(blank=True, null=True)  # TODO: Function?

    class Meta:
        verbose_name = _('Issue')
        verbose_name_plural = _('Issues')

    def __unicode__(self):
        pass

    def save(self):
        pass

    @models.permalink
    def get_absolute_url(self):
        return ('')

    # TODO: Define custom methods here
