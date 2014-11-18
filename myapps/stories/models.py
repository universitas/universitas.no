# -*- coding: utf-8 -*-
""" Content in the publication. """

# Python standard library
import re
import difflib
import logging
logger = logging.getLogger('universitas')

# Django core
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.utils import translation
from django.conf import settings
from django.db import models
from django.core.cache import cache
from django.utils.text import slugify
from django.core.exceptions import ObjectDoesNotExist
from django.core.validators import MaxValueValidator, MinValueValidator, URLValidator, ValidationError
from django.utils.safestring import mark_safe
from model_utils.models import TimeStampedModel
from django.core.urlresolvers import reverse

# Installed apps
from bs4 import BeautifulSoup
from requests import request
from requests.exceptions import Timeout, MissingSchema

# Project apps
from myapps.contributors.models import Contributor
from myapps.markup.models import BlockTag, InlineTag, Alias
from myapps.photo.models import ImageFile
from myapps.frontpage.models import FrontpageStory
# from myapps.issues.models import PrintIssue


class Section(models.Model):

    """
    A Section in the publication containing one kind of content.
    """

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
            # soup = BeautifulSoup(self.bodytext_html)
            # self.bodytext_html = soup.prettify()
        super().save(*args, **kwargs)

    def clean_markup(self):
        """ Cleans up and normalises raw input from user or import. """
        bodytext = []
        for paragraph in self.bodytext_markup.splitlines():
            paragraph = Alias.objects.replace(content=paragraph, timing=1)
            bodytext.append(paragraph)
        bodytext = '\n'.join(bodytext)
        bodytext = Alias.objects.replace(content=bodytext, timing=2)
        self.bodytext_markup = bodytext

    def make_html(self):
        """ Create html body text from markup """
        html_blocks = []
        paragraphs = self.bodytext_markup.splitlines()
        for paragraph in paragraphs:
            # Apply block scope tags.
            paragraph = BlockTag.objects.make_html(paragraph)
            # Apply inline tags.
            paragraph = InlineTag.objects.make_html(paragraph)
            html_blocks.append(paragraph)
        self.bodytext_html = ' '.join(html_blocks)

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
        return super().get_queryset().filter(status=Story.STATUS_PUBLISHED).filter(publication_date__lt=now)

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
    STATUS_CHOICES = [
        (STATUS_DRAFT, _('Draft')),
        (STATUS_EDITOR, _('Ready to edit')),
        (STATUS_READY, _('Ready to publish on website')),
        (STATUS_PUBLISHED, _('Published on website')),
        (STATUS_PRIVATE, _('Will not be published')),
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
    status = models.IntegerField(
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
    images = models.ManyToManyField(
        ImageFile, through='StoryImage',
        help_text=_('connected images with captions.'),
        verbose_name=_('images'),
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
        return '{} {:%Y-%m-%d}'.format(
            self.title, self.publication_date)

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
        return self.images.count()

    @property
    def section(self):
        """ Shortcut to related Section """
        return self.story_type.section

    def save(self, *args, **kwargs):
        # slugify title. Remove underscores and n-dash. If slug has been changed,
        # old url will redirect to new url with status code 301.
        self.slug = slugify(self.title).replace('_', '').replace('–', '-')[:50]
        # bylines are cached in a modelfield for quicker search and admin display,
        # avoiding joins and extra queries Only used in back-end
        self.bylines_html = self.get_bylines_as_html()
        super(Story, self).save(*args, **kwargs)

        # create a frontpagestory only if there are linked images. This avoids an
        # empty frontpagestory when the model is initally saved before any related
        # storyimage instances exist.
        if self.images.count() != 0 and self.frontpagestory_set.count() == 0:
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
            new_element = Aside(
                parent_story=self,
            )

        elif element == "pullquote":
            new_element = Pullquote(
                parent_story=self,
            )

        return new_element._block_append(tag, content)


class StoryElement(models.Model):

    """ Models that are placed somewhere inside an article """

    MAXPOSITION = 10000
    parent_story = models.ForeignKey('Story')
    published = models.BooleanField(
        default=True,
        help_text=_('Choose whether this element is published'),
        verbose_name=_('published')
    )
    position = models.PositiveSmallIntegerField(
        default=0,
        validators=[
            MaxValueValidator(MAXPOSITION),
            MinValueValidator(0)],
        help_text=_(
            'Where in the story does this belong? {start} = At the very beginning, {end} = At the end.'.format(
                start=0, end=MAXPOSITION)),
        verbose_name=_('position'),
    )

    class Meta:
        abstract = True


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
        url = self.validate_url(self.link)
        try:
            status_code = str(request(method, url, timeout=timeout).status_code)
        except Timeout:
            status_code = 408  # HTTP Timout
        except MissingSchema:
            status_code = 0  # not a HTTP url
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
                link = cls.objects.get_or_create(number=ref, parent_story=parent_story,)[0]
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
    def convert_html_links(cls, bodytext):
        """ convert <a href=""> to other tag """
        # if '&' in bodytext:
            # find = re.findall(r'.{,20}&.{,20}', bodytext)
            # logger.debug(find)
        soup = BeautifulSoup(bodytext)
        for link in soup.find_all('a'):
            href = link.get('href')
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
            logger.debug('found link: {link} - replace with: {replacement}'.format(link=link, replacement=replacement))

        return str(soup)

    @classmethod
    def validate_url(cls, url):
        """ Checks if input string is a valid http url. """
        site = 'universitas.no'  # todo - get from settings.
        url = url.strip('«»“”"\'')
        if url.startswith('//'):
            url = 'http:{url}'.format(url=url)
        if url.startswith('/'):
            url = 'http://{site}{url}'.format(site=site, url=url)
        if not url.startswith('http://'):
            url = 'http://{url}'.format(url=url)
        try:
            validate = URLValidator()
            validate(url)
            return url
        except ValidationError:
            return None

    def insert_html(self, bodytext_html):
        """ inserts the link as a html element in parent story """
        link_tag = self.get_html()
        pattern = r'\[.*?\]\({number}\)'.format(number=self.number)
        if re.search(pattern, bodytext_html):
            bodytext_html = re.sub(pattern, link_tag, bodytext_html)
            logger.debug('change link: {pattern} - replace with: {tag}'.format(pattern=pattern, tag=link_tag))
        else:
            logger.warning('could not find link: {pattern} - replace with: {tag}'.format(pattern=pattern, tag=link_tag))

        return bodytext_html


class Pullquote(TextContent, StoryElement):

    """ A quote that is that is pulled out of the content. """

    class Meta(StoryElement.Meta):
        verbose_name = _('Pullquote')
        verbose_name_plural = _('Pullquotes')

    def find_pullquote_in_bodytext(self):
        """ Looks for the first paragraph in the parent story that matches pullquote content."""
        needle = re.sub(
            '@\S+:|«|»', '', self.bodytext_markup.splitlines()[0],
        )[:30].lower().strip()
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
        super().save(*args, **kwargs)


class StoryImage(StoryMedia):

    """ Photo or illustration connected to a story """

    class Meta(StoryElement.Meta):
        verbose_name = _('Image')
        verbose_name_plural = _('Images')

    imagefile = models.ForeignKey(
        ImageFile,
        help_text=_('Choose an image by name or upload a new one.'),
        verbose_name=('image file'),
    )


class StoryVideo(StoryMedia):

    """ Video content connected to a story """

    VIDEO_HOSTS = (
        ('vimeo', _('vimeo'),),
        ('youtu', _('youtube'),),
    )

    class Meta(StoryElement.Meta):
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


class Byline(models.Model):

    """ Credits the people who created content for a story. """

    CREDIT_CHOICES = [
        ('text', _('Text',)),
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
            r'^(?P<credit>[^:, ]+): (?P<full_name>[^,]+)\s*(, (?P<title>.+))?$'
        )

        match = byline_pattern.match(full_byline)
        try:
            d = match.groupdict()
            full_name = d['full_name'].title()
            title = d['title'] or ''
            credit = d['credit'].lower()
            initials = ''.join(letters[0] for letters in full_name.replace('-', ' ').split())
            assert initials == initials.upper()  # All names should be capitalisedd.
            assert len(initials) <= 5  # Five names probably means something is wrong.
            if len(initials) == 1:
                initials = full_name.upper()

        except (AssertionError, AttributeError, ) as e:
            # Malformed byline
            logger.warning(
                'Malformed byline: "{byline}" error: {error} prodsak_id: {prodsak_id}'.format(
                    prodsak_id=story.prodsak_id,
                    story=story,
                    byline=full_byline,
                    error=e
                )
            )

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
        (r'\s*(,\s|\s[oO]g\s|\s[aA]nd\s)\s*([A-ZÆØÅ][a-zæøå]+ [A-ZÆØÅ])', r'\n\2', 0),

        # words in parantheses at end of line is probably some creditation. Put in front with colon instead.
        (r'^(.*?) *\(([^)]*)\) *$', r'\2: \1', re.M),

        # "Anmeldt av" is text credit.
        (r'anmeldt av:?', 'text: ', re.I),

        # Any word containging "photo" is some kind of photo credit.
        (r'\S*(ph|f)oto\S*?[\s:]*', '\nphoto: ', re.I),

        # Any word containing "text" is text credit.
        (r'\S*te(ks|x)t\S*?[\s:]*', '\ntext: ', re.I),

        # These words are stripped from end of line.
        (r' *(,| og| and) *$', '', re.M + re.I),

        # These words are stripped from start of line
        (r'^ *(,|og |and |av ) *', '', re.M + re.I),

        # These words are stripped from after colon
        (r': *(,|og |and |av ) *', ':', re.M + re.I),

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
