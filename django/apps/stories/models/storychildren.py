"""Story child elements"""

import logging
import re

from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.dispatch import receiver
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel
from requests import request
from requests.exceptions import MissingSchema, Timeout
from slugify import Slugify

from apps.photo.models import ImageFile
from utils.decorators import cache_memoize

from .mixins import MarkupCharField, MarkupModelMixin, TextContent

slugify = Slugify(max_length=50, to_lower=True)
logger = logging.getLogger(__name__)

TOP = 'head'
DEFAULT_IMAGE_SIZE = (1200, 675)  # 16:9 ratio


class ElementQuerySet(models.QuerySet):
    def top(self):
        """ Elements that are placed at the start of the parent article """
        return self.published().filter(placement=TOP)

    def inline(self):
        """ Elements that are placed inside the story """
        return self.published().exclude(placement=TOP)

    def published(self):
        return self.filter(placement__isnull=False)

    def unpublished(self):
        return self.filter(placement__isnull=True)


class StoryChild(TimeStampedModel):
    """ Models that are placed somewhere inside an article """
    objects = ElementQuerySet.as_manager()

    class Meta:
        abstract = True
        ordering = ['index']

    ordering = models.SmallIntegerField(
        default=0,
        blank=True,
        null=True,
        help_text=_('Internal order within placement'),
        verbose_name=_('ordering'),
    )
    placement = models.CharField(
        max_length=100,
        default='head',
        blank='true',
        help_text=_('Placement of this element'),
        verbose_name=_('placement'),
    )

    index = models.PositiveSmallIntegerField(
        default=0,
        blank=True,
        null=True,
        help_text=_('Leave blank to unpublish'),
        verbose_name=_('index'),
    )

    @property
    def top(self):
        return self.placement == TOP

    @property
    def published(self):
        return bool(self.placement)

    def siblings(self):
        return self.__class__.objects.filter(parent_story=self.parent_story)


class Pullquote(TextContent, StoryChild):  # type: ignore
    """ A quote that is that is pulled out of the content. """

    parent_story = models.ForeignKey(
        'Story',
        related_name='pullquotes',
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name = _('Pullquote')
        verbose_name_plural = _('Pullquotes')


class Aside(TextContent, StoryChild):  # type: ignore
    """ Fact box or other information typically placed in side bar """
    parent_story = models.ForeignKey(
        'Story',
        related_name='asides',
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name = _('Aside')
        verbose_name_plural = _('Asides')


class InlineHtml(StoryChild):
    """ Inline html code """

    parent_story = models.ForeignKey(
        'Story',
        related_name='inline_html_blocks',
        on_delete=models.CASCADE,
    )
    bodytext_html = models.TextField()

    class Meta:
        verbose_name = _('Inline HTML block')
        verbose_name_plural = _('Inline HTML blocks')

    def get_html(self):
        """ Returns text content as html. """
        return mark_safe(self.bodytext_html)


def ratio(w, h):
    """Calculate ratio as float"""
    return round(h / w, 4)


class StoryMedia(StoryChild, MarkupModelMixin):
    """ Video, photo or illustration connected to a story """

    AUTO_RATIO = 0.0

    ASPECT_RATIO_CHOICES = [
        (AUTO_RATIO, _('auto')),
        (ratio(5, 2), _('5:2 landscape')),
        (ratio(2, 1), _('2:1 landscape')),
        (ratio(16, 9), _('16:9 landscape (youtube)')),
        (ratio(3, 2), _('3:2 landscape')),
        (ratio(4, 3), _('4:3 landscape')),
        (ratio(1, 1), _('1:1 square')),
        (ratio(3, 4), _('3:4 portrait')),
        (ratio(2, 3), _('2:3 portrait')),
        (ratio(1, 2), _('1:2 portrait')),
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
        default=AUTO_RATIO,
    )

    def original_ratio(self):
        """ Width:Height ratio of the original media file. """
        return 2 / 1

    def get_height(self, width, height):
        """ Calculate pixel height based on builtin ratio """

        if self.aspect_ratio == self.AUTO_RATIO:
            height = height
        else:
            height = width * self.aspect_ratio
        return int(height)


class StoryImage(StoryMedia):
    """ Photo or illustration connected to a story """

    class Meta:
        verbose_name = _('Image')
        verbose_name_plural = _('Images')
        unique_together = [('parent_story', 'imagefile')]
        ordering = ['-ordering']

    parent_story = models.ForeignKey(
        'Story',
        related_name='images',
        on_delete=models.CASCADE,
    )

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

    @property
    def filename(self):
        try:
            return str(self.imagefile)
        except ObjectDoesNotExist:
            return '[no image]'

    @property
    def small(self):
        return self.imagefile.small

    @cache_memoize()
    def large(self):
        return self.imagefile.large.url

    @property
    def crop_size(self):
        width, height = DEFAULT_IMAGE_SIZE
        im = self.imagefile
        if self.aspect_ratio == self.AUTO_RATIO:
            if not im.is_photo:
                height = width * self.original_ratio()
        else:
            height = width * self.aspect_ratio
        return int(width), int(height)

    @cache_memoize()
    def cropped(self):
        width, height = self.crop_size
        im = self.imagefile
        return im.thumbnail(
            f'{width}x{height}', crop_box=im.get_crop_box(), expand=1
        ).url


class StoryVideo(StoryMedia):
    """ Video content connected to a story """

    VIDEO_HOSTS = (
        ('vimeo', _('vimeo')),
        ('youtu', _('youtube')),
    )

    class Meta:
        verbose_name = _('Video')
        verbose_name_plural = _('Videos')

    parent_story = models.ForeignKey(
        'Story',
        related_name='videos',
        on_delete=models.CASCADE,
    )
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


@receiver(models.signals.post_save)
def story_modified(sender, instance, **kwargs):
    if not issubclass(sender, StoryChild):
        return
    from apps.stories.models import Story
    Story.objects.filter(pk=instance.parent_story.pk
                         ).update(modified=instance.modified)
