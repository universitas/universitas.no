""" The main content model """

import logging

from apps.contributors.models import Contributor
from apps.frontpage.models import FrontpageStory
from django.conf import settings
from django.core.cache import cache
from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django_extensions.db.fields import AutoSlugField
from model_utils.models import TimeStampedModel
from slugify import Slugify
from utils.decorators import cache_memoize
from utils.model_mixins import EditURLMixin

from .mixins import MarkupCharField, MarkupTextField, TextContent
from .related_stories import RelatedStoriesMixin
from .search_mixin import FullTextSearchMixin, FullTextSearchQuerySet
from .sections import StoryType, default_story_type
from .storychildren import Aside, Pullquote

slugify = Slugify(max_length=50, to_lower=True)
logger = logging.getLogger(__name__)


class StoryQuerySet(FullTextSearchQuerySet, models.QuerySet):
    def published(self):
        now = timezone.now()
        return self.filter(
            publication_status__in=[
                Story.STATUS_PUBLISHED,
                Story.STATUS_NOINDEX,
            ]
        ).filter(publication_date__lt=now
                 ).select_related('story_type__section')


class PublishedStoryManager(models.Manager):
    def get_queryset(self):
        return StoryQuerySet(self.model, using=self._db)

    def devalue_hotness(self, factor=1.0):
        """Devalue hot count for all stories."""
        hot_stories = self.filter(hot_count__gte=1)
        hot_stories.update(hot_count=(models.F('hot_count') - 1) * factor)
        cold_stories = self.filter(hot_count__gt=0, hot_count__lt=1)
        cold_stories.update(hot_count=0)


class Story(  # type: ignore
    FullTextSearchMixin,
    EditURLMixin,
    TimeStampedModel,
    TextContent,
    RelatedStoriesMixin,
):
    """ An article or story in the newspaper. """

    VISIT_KEY_PREFIX = 'story_hit_'

    class Meta(FullTextSearchMixin.Meta):
        abstract = False
        verbose_name = _('Story')
        verbose_name_plural = _('Stories')

    objects = PublishedStoryManager.from_queryset(StoryQuerySet)()
    template_name = 'bodytext.html'

    STATUS_DRAFT = 0
    STATUS_JOURNALIST = 3
    STATUS_SUBEDITOR = 4
    STATUS_EDITOR = 5
    STATUS_TO_DESK = 6
    STATUS_AT_DESK = 7
    STATUS_FROM_DESK = 9
    STATUS_PUBLISHED = 10
    STATUS_NOINDEX = 11
    STATUS_PRIVATE = 15
    STATUS_TEMPLATE = 100
    STATUS_ERROR = 500
    COMMENT_FIELD_CHOICES = [
        ('facebook', _('facebook')),
        ('disqus', _('disqus')),
        ('off', _('off')),
    ]
    STATUS_CHOICES = [
        (STATUS_DRAFT, _('Draft')),
        (STATUS_JOURNALIST, _('To Journalist')),
        (STATUS_SUBEDITOR, _('To Sub Editor')),
        (STATUS_EDITOR, _('To Editor')),
        (STATUS_TO_DESK, _('Ready for newsdesk')),
        (STATUS_AT_DESK, _('Imported to newsdesk')),
        (STATUS_FROM_DESK, _('Exported from newsdesk')),
        (STATUS_PUBLISHED, _('Published on website')),
        (STATUS_NOINDEX, _('Published, but hidden from search engines')),
        (STATUS_PRIVATE, _('Will not be published')),
        (STATUS_TEMPLATE, _('Used as template for new articles')),
        (STATUS_ERROR, _('Technical error')),
    ]

    prodsak_id = models.PositiveIntegerField(
        blank=True,
        null=True,
        editable=False,
        help_text=_('primary id in the legacy prodsys database.'),
        verbose_name=_('prodsak id')
    )
    language = models.CharField(
        max_length=10,
        help_text=_('language'),
        verbose_name=_('language'),
        choices=settings.LANGUAGES,
        default=settings.LANGUAGES[0][0],
    )
    title = MarkupCharField(
        max_length=1000,
        help_text=_('main headline or title'),
        verbose_name=_('title'),
    )
    slug = AutoSlugField(
        _('slug'),
        default='story-slug',
        allow_duplicates=True,
        populate_from=('title', ),
        max_length=50,
        overwrite=True,
        slugify_function=slugify,
    )
    kicker = MarkupCharField(
        max_length=1000,
        blank=True,
        help_text=_(
            'secondary headline, usually displayed above main headline'
        ),
        verbose_name=_('kicker'),
    )
    url = models.CharField(
        editable=False,
        blank=True,
        default='',
        max_length=256,
    )
    lede = MarkupTextField(
        blank=True,
        help_text=_('brief introduction or summary of the story'),
        verbose_name=_('lede'),
    )
    comment = models.TextField(
        default='',
        blank=True,
        help_text=_('for internal use only'),
        verbose_name=_('comment'),
    )
    theme_word = MarkupCharField(
        max_length=100,
        blank=True,
        help_text=_('theme, topic, main keyword'),
        verbose_name=_('theme word'),
    )
    bylines = models.ManyToManyField(
        Contributor,
        through='Byline',
        help_text=_('the people who created this content.'),
        verbose_name=_('bylines'),
    )
    story_type = models.ForeignKey(
        StoryType,
        help_text=_('the type of story.'),
        verbose_name=_('article type'),
        default=default_story_type,
        on_delete=models.SET_DEFAULT,
    )
    publication_date = models.DateTimeField(
        null=True,
        blank=True,
        help_text=_('when this story will be published on the web.'),
        verbose_name=_('publication date'),
    )
    publication_status = models.IntegerField(
        default=STATUS_DRAFT,
        choices=STATUS_CHOICES,
        help_text=_('publication status.'),
        verbose_name=_('status'),
    )
    issue = models.ForeignKey(
        'issues.PrintIssue',
        help_text=_('which issue this story was printed in.'),
        verbose_name=_('issue'),
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
    )
    page = models.IntegerField(
        blank=True,
        null=True,
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
        default=1000,  # All stories are hot when first published!
        editable=False,
        help_text=_('calculated value representing recent page views.'),
        verbose_name=_('recent page views')
    )
    legacy_html_source = models.TextField(
        blank=True,
        null=True,
        editable=False,
        help_text=_('From old web page. For reference only.'),
        verbose_name=_('Imported html source.'),
    )
    legacy_prodsys_source = models.TextField(
        blank=True,
        null=True,
        editable=False,
        help_text=_('From prodsys. For reference only.'),
        verbose_name=_('Imported xtagged source.'),
    )
    working_title = models.CharField(
        max_length=1000,
        blank=True,
        help_text=_('Working title'),
        verbose_name=_('Working title'),
    )
    comment_field = models.CharField(
        max_length=16,
        choices=COMMENT_FIELD_CHOICES,
        default=COMMENT_FIELD_CHOICES[0][0],
        help_text=_('Enable comment field'),
        verbose_name=_('Comment Field'),
    )

    def __str__(self):
        title = self.title or f'({self.working_title})' or '[no title]'
        date = self.publication_date
        if date:
            return '{:%Y-%m-%d}: {}'.format(date, title)
        else:
            return title

    def save(self, *args, **kwargs):
        if not self.working_title:
            self.working_title = self.title or f'[{self.story_type}]'

        self.url = self.get_absolute_url() if self.pk else ''

        if self.is_published(False) and not self.publication_date:
            self.publication_date = timezone.now()

        super().save(*args, **kwargs)

        if self.publication_status == self.STATUS_TO_DESK:
            from apps.stories.tasks import upload_storyimages
            upload_storyimages.delay(self.pk)

        if (self.publication_status >= self.STATUS_FROM_DESK):
            FrontpageStory.objects.create_for_story(story=self)

    @property
    def comments_plugin(self):
        if self.is_published():
            return self.comment_field
        return 'off'

    @classmethod
    def register_visit_in_cache(cls, pk, n=1):
        """Register valid visit in cache. Use scheduled task to persist in
        database."""
        hit_key = f'{cls.VISIT_KEY_PREFIX}{pk}'
        try:
            cache.incr(hit_key, n)
        except ValueError:
            NEVER = None
            cache.add(hit_key, n, timeout=NEVER)

    def is_published(self, check_date=True):
        """Is this Story public"""
        public = [Story.STATUS_NOINDEX, Story.STATUS_PUBLISHED]
        if self.publication_status in public:
            if check_date:
                try:
                    return self.publication_date <= timezone.now()
                except TypeError:
                    return False
            else:
                return True
        else:
            return False

    @property
    def priority(self):
        """ Calculate a number between 1 and 12 to determine initial
        front page priority. """
        # TODO: Placeholder priority for story.
        pri = 0
        pri += 1 * bool(self.lede)
        pri += 2 * bool(self.main_image())
        pri += 1 * bool(self.kicker)
        pri += 3 * ('@tit' in self.bodytext_markup)
        pri += len(self.bodytext_markup) // 1000
        return min(12, pri)

    def valid_page_view(self, request):
        """Check if page view looks like a valid visit"""
        if not self.is_published():
            # Only count hits on published pages.
            return False
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
        ip = request.META.get('REMOTE_ADDR')

        if not user_agent or not ip:
            # Visitor is not using a web browser.
            return False

        bots = ['bot', 'spider', 'yahoo', 'crawler']
        if any(bot in user_agent for bot in bots):
            # Search engine web crawler.
            return False

        cache_key = f'{self.pk}_{ip}'
        if cache.get(cache_key):
            # same ip address has visited page recently
            return False
        else:
            FIVE_MINUTES = 60 * 5
            cache.set(cache_key, 1, timeout=FIVE_MINUTES)
            return True

    def get_bylines(self):
        # with translation.override()
        # translation.activate(settings.LANGUAGE_CODE)
        authors = []
        for bl in self.byline_set.select_related('contributor'):
            authors.append(
                '{name}{title}'.format(
                    name=bl.contributor.display_name,
                    title=', {}'.format(bl.title) if bl.title else '',
                    # credit=bl.get_credit_display(),
                )
            )
        # translation.deactivate()
        return ', '.join(authors)

    def image_count(self):
        """ Number of story images related to the story """
        return len(self.images.all())

    def main_image(self):
        """ Get the top image if there is any. """
        return self.images.order_by('-size', '-ordering').first()

    @cache_memoize()
    def facebook_thumb(self):
        if self.main_image():
            imagefile = self.main_image().imagefile
            return imagefile.thumbnail(
                size='800x420',
                crop_box=imagefile.get_crop_box(),
            )

    @property
    def section(self):
        """ Shortcut to related Section """
        return self.story_type.section

    def clear_html(self):
        """ clears html after child is changed """
        if self.bodytext_html != '':
            Aside.objects.filter(parent_story__pk=self.pk
                                 ).update(bodytext_html='')
            Pullquote.objects.filter(parent_story__pk=self.pk
                                     ).update(bodytext_html='')
            self.bodytext_html = ''
            self.save(update_fields=['bodytext_html'])

    def get_shortlink(self):
        url = reverse(
            viewname='article_short',
            kwargs={
                'story_id': str(self.id),
            },
        )
        return url

    def get_absolute_url(self):
        if self.url:
            return self.url
        return reverse(
            viewname='ssr',
            kwargs={
                'story': str(self.id),
                'section': self.section.slug + '/',
                'slug': '/' + self.slug,
            }
        )

    def children_modified(self):
        """ check if any related objects have been
        modified after self was last saved. """
        children = (
            self.videos, self.images, self.inline_links,
            self.inline_html_blocks, self.asides, self.pullquotes
        )
        return any(
            qs.filter(modified__gt=self.modified).count() > 0
            for qs in children
        )

    @property
    def tekst(self):
        """Property getter used by legacy api for indesign"""
        output = []
        head_tags = [('tit', 'title'), ('ing', 'lede'), ('tema', 'theme_word'),
                     ('stikktit', 'kicker')]
        for tag, attr in head_tags:
            text = getattr(self, attr)
            if text:
                output.append(f'@{tag}: {text}')
        for bl in self.byline_set.all():
            output.append(str(bl))
        output.append(self.bodytext_markup)
        for aside in self.asides.all():
            output.append(aside.bodytext_markup)
        for pullquote in self.pullquotes.all():
            output.append(pullquote.bodytext_markup)
        return '\n'.join(output)

    @tekst.setter
    def tekst(self, value):
        """Property setter used by legacy api for indesign"""
        self.title = ''
        self.lede = ''
        self.theme_word = ''
        self.asides.all().delete()
        self.pullquotes.all().delete()
        self.bodytext_markup = value
