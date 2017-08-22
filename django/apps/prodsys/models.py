""" Replacement for legacy prodsys app. """
from django.utils.translation import ugettext_lazy as _
from django.db import models
import diff_match_patch

from apps.photo.models import ImageFile
from apps.stories.models import StoryType
from apps.issues.models import Issue
from apps.contributors.models import Contributor
import logging
logger = logging.getLogger(__name__)


class BylineCredit:
    BY = 'by'
    TEXT = 'text'
    PHOTO = 'photo'
    VIDEO = 'video'
    ILLUSTRATION = 'illustration'
    TRANSLATION = 'translation'
    GRAPHICS = 'graphics'
    CHOICES = (
        (BY, _('by')),  # used for opinion pieces
        (TEXT, _('text')),  # used for journalism
        (PHOTO, _('photo')),
        (VIDEO, _('video')),
        (ILLUSTRATION, _('illustration')),
        (TRANSLATION, _('translation')),
        (GRAPHICS, _('graphics')),
    )


class StoryStatus:
    DRAFT = 10
    WORK_IN_PROGRESS = 20
    READY_FOR_PRINT = 30
    PRINT__DESK = 40
    READY_FOR_WEB = 50
    PUBLISHED_WEB = 60
    SHELVED = 90
    DELETED = 100
    CHOICES = (
        (DRAFT, _('draft')),
        (WORK_IN_PROGRESS, _('work in progress')),
        (READY_FOR_PRINT, _('ready for print layout')),
        (PRINT__DESK, _('print layout in progress')),
        (READY_FOR_WEB, _('ready for web publishing')),
        (PUBLISHED_WEB, _('published on web site')),
        (SHELVED, _('shelved')),
        (DELETED, _('deleted')),
    )


class ProdStory(models.Model):
    """ Story in Production """

    STATUS = StoryStatus

    status = models.PositiveSmallIntegerField(
        default=StoryStatus.DRAFT,
        verbose_name=_('status'),
        help_text=_('status'),
        choices=StoryStatus.CHOICES,
    )
    working_title = models.CharField(
        default='new story',
        max_length=200,
        verbose_name=_('working_title'),
        help_text=_('working_title'),
    )
    content = models.TextField(
        verbose_name=_('content'),
        help_text=_('raw markup content'),
    )
    comments = models.TextField(
        verbose_name=_('comments'),
        help_text=_('comments'),
    )
    story_type = models.ForeignKey(
        StoryType,
        verbose_name=_('story_type'),
        help_text=_('story_type'),
    )
    issue = models.ForeignKey(
        Issue,
        null=True,
        related_name='stories',
        verbose_name=_('issue'),
        help_text=_('issue'),
    )

    class Meta:
        verbose_name = _('prodsys story')
        verbose_name_plural = _('prodsys stories')
        permissions = [
            ('change_status', _('can change story status')),
        ]


class StoryPatch(models.Model):
    story = models.ForeignKey(
        ProdStory,
        related_name='patches',
        verbose_name=_('story'),
        help_text=_('story'),
    )
    created = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('created'),
        help_text=_('created'),
    )
    contributor = models.ForeignKey(
        Contributor,
        null=True,
        default=None,
        verbose_name=_('contributor'),
        help_text=_('contributor'),
    )
    patch = models.TextField(
        verbose_name=_('patch'),
        help_text=_('patch'),
    )
    reverse_patch = models.TextField(
        default='',
        verbose_name=_('reverse_patch'),
        help_text=_('reverse_patch'),
    )
    applied = models.BooleanField(
        default=False,
        verbose_name=_('applied'),
        help_text=_('applied'),
    )

    def apply(self, save=True, original_content=None):
        """apply patch to story content"""
        df = diff_match_patch.diff_match_patch()
        if original_content is None:
            original_content = self.story.content
        patches = df.patch_fromText(self.patch)
        patched_content, results = df.patch_apply(patches, original_content)
        if not all(results):
            logger.warn('Incomplete patch: %s %s' % (results, self.patch))
        if not self.reverse_patch:
            rev_patches = df.patch_make(patched_content, original_content)
            self.reverse_patch = df.patch_toText(rev_patches)
        if save:
            self.applied = True
            self.story.content = patched_content
            self.story.save(update_fields=['content'])
            self.save()
        return patched_content

    def unapply(self, original_content=None):
        """unapply patch to story content"""
        df = diff_match_patch.diff_match_patch()
        if original_content is None:
            original_content = self.story.content
        patches = df.patch_fromText(self.reverse_patch)
        patched_content, results = df.patch_apply(patches, original_content)
        if not all(results):
            logger.warn('Incomplete patch: %s %s' % (results,
                                                     self.reverse_patch))
        return patched_content

    @classmethod
    def create_from_story(cls, story, patched_content, applied=False):
        df = diff_match_patch.diff_match_patch()
        original_content = story.content
        patch = df.patch_toText(
            df.patch_make(original_content, patched_content))
        obj = cls(
            story=story,
            patch=patch,
            applied=applied,
        )
        obj.save()
        return obj


class ProdImage(models.Model):

    """ Image with caption """

    priority = models.PositiveSmallIntegerField(
        default=1,
        verbose_name=_('priority'),
        help_text=_('How prominent this image should be in the layout.'),
    )
    position = models.PositiveSmallIntegerField(
        default=0,
        verbose_name=_('position'),
        help_text=_('Where this image should be positioned in the layout. '
                    '0 is used for header images, other images that should '
                    'be grouped together should have the same position value'
                    )
    )
    image = models.ForeignKey(
        ImageFile,
        verbose_name=_('image'),
        help_text=_('image'),
    )
    story = models.ForeignKey(
        ProdStory,
        related_name='images',
        verbose_name=_('story'),
        help_text=_('story'),
    )
    caption = models.CharField(
        max_length=1000,
        verbose_name=_('caption'),
        help_text=_('caption'),
    )

    class Meta:
        verbose_name = _('prodsys image')
        verbose_name_plural = _('prodsys images')


class ProdByline(models.Model):

    """ Credits the people who created content for a story. """

    story = models.ForeignKey(ProdStory)
    contributor = models.ForeignKey(Contributor)
    index = models.IntegerField(
        default=1,
        verbose_name=_('index'),
        help_text=_('internal ordering of bylines'),
    )
    credit = models.CharField(
        choices=BylineCredit.CHOICES,
        default=BylineCredit.BY,
        max_length=32,
        verbose_name=_('credit'),
        help_text=_('what this person contributed with'),
    )
    description = models.CharField(
        max_length=300,
        blank=True,
        verbose_name=_('description'),
        help_text=_('person\'s title, qualification or location'),
    )

    class Meta:
        verbose_name = _('ProdByline')
        verbose_name_plural = _('Bylines')

    def __str__(self):
        return '@bl: {credit}: {full_name}{title})'.format(
            credit=self.get_credit_display(),
            full_name=self.contributor,
            title='' if not self.title else f', {self.title}',
        )
