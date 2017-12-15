"""Story child elements"""

import logging
import re

from requests import request
from requests.exceptions import MissingSchema, Timeout

from apps.photo.models import ImageFile
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel
from slugify import Slugify

from .mixins import MARKUP_TAGS, MarkupCharField, MarkupModelMixin, TextContent

slugify = Slugify(max_length=50, to_lower=True)
logger = logging.getLogger(__name__)


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

    qs_methods = [
        attr for attr in dir(ElementQuerySet) if not attr.startswith('_')
    ]

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

    @classmethod
    def markup_tag(cls):
        tag = MARKUP_TAGS.get(cls.__name__, '')
        return f'@{tag}:'

    objects = ElementManager()
    parent_story = models.ForeignKey(
        'Story',
        on_delete=models.CASCADE,
    )
    index = models.PositiveSmallIntegerField(
        default=0,
        blank=True,
        null=True,
        help_text=_('Leave blank to unpublish'),
        verbose_name=_('index'),
    )
    top = models.BooleanField(
        # editable=False,
        default=False,
        help_text=_('Is this element placed on top?'),
    )

    class Meta:
        verbose_name = _('story element')
        verbose_name_plural = _('story elements')
        ordering = ['index']

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
                last_item = self.siblings().filter(index__isnull=False
                                                   ).order_by('index').last()
                if last_item:
                    # Set index to be higher than the previous object of the
                    # same class.
                    self.index = last_item.index + 1
                else:
                    self.index = 1

        super().save(*args, **kwargs)
        self.parent_story.clear_html()


class Pullquote(TextContent, StoryElement):  # type: ignore
    """ A quote that is that is pulled out of the content. """

    def needle(self):
        firstline = self.bodytext_markup.splitlines()[0]
        needle = re.sub('@\S+:|«|»', '', firstline)
        return needle

    class Meta:
        verbose_name = _('Pullquote')
        verbose_name_plural = _('Pullquotes')


class Aside(TextContent, StoryElement):  # type: ignore
    """ Fact box or other information typically placed in side bar """

    class Meta:
        verbose_name = _('Aside')
        verbose_name_plural = _('Asides')


class InlineHtml(StoryElement):
    """ Inline html code """

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

    class Meta:
        verbose_name = _('Image')
        verbose_name_plural = _('Images')

    imagefile = models.ForeignKey(
        ImageFile,
        help_text=_('Choose an image by name or upload a new one.'),
        verbose_name=('image file'),
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f'[{self.imagefile}]'

    def original_ratio(self):
        try:
            return self.imagefile.full_height / self.imagefile.full_width
        except TypeError:
            logger.warn(
                'cannot calculate ratio for image %s' % (self.imagefile, )
            )
            return super().original_ratio()

    def needle(self):
        """ Look for a name in the text """
        needle = re.sub(r'^.+:', '', self.caption)
        name = re.search(r'([A-ZÆØÅ]\w+ ){2,}', needle)
        if name:
            needle = name.group(0)
        return needle.strip()[:60] or str(self.imagefile)

    @property
    def filename(self):
        try:
            return str(self.imagefile)
        except ObjectDoesNotExist:
            return '[no image]'

    @property
    def small(self):
        return self.imagefile.small

    @property
    def preview(self):
        return self.imagefile.preview


class StoryVideo(StoryMedia):
    """ Video content connected to a story """

    VIDEO_HOSTS = (
        ('vimeo', _('vimeo')),
        ('youtu', _('youtube')),
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
            'the part of the url that identifies this particular video'
        )
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
                '</iframe>'
            )
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
            height=height,
            width=width,
            host_video_id=self.host_video_id,
        )

    @property
    def link(self):
        pk = self.host_video_id
        if self.video_host == 'youtu':
            return f'https://www.youtube.com/watch?v={pk}'
        elif self.video_host == 'vimeo':
            return f'https://vimeo.com/{pk}'
        return ''

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
                    request(method, url, timeout=timeout).status_code
                )
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
