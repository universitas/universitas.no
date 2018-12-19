""" Contributors to the thing """

from collections import namedtuple
import json
import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.postgres.search import TrigramSimilarity
from django.db import models
from django.dispatch import receiver
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel

from utils.decorators import cache_memoize

from .fuzzy_name_search import FuzzyNameSearchMixin

STAFF_GROUP = 'redaksjon'
MANAGEMENT_GROUP = 'mellomledere'

User = get_user_model()
logger = logging.getLogger(__name__)


def today():
    return timezone.now().date()


def yesterday():
    return timezone.now().date() - timezone.timedelta(days=1)


def default_groups():
    """Get or create editorial staff groups"""
    staff = Group.objects.get_or_create(name=STAFF_GROUP)[0]
    management = Group.objects.get_or_create(name=MANAGEMENT_GROUP)[0]
    return namedtuple('Groups', 'management, staff')(management, staff)


class ContributorQuerySet(models.QuerySet):
    def match(self, query, cutoff=0.5):
        """stricter name search"""
        return self.annotate(
            similarity=TrigramSimilarity('display_name', query)
        ).filter(similarity__gt=cutoff).order_by('-similarity')

    def search(self, query, cutoff=0.5):
        """fuzzy name search"""
        trigram = TrigramSimilarity('display_name', query)
        queryset = self.annotate(similarity=trigram).order_by('-similarity')
        result = queryset.filter(similarity__gt=cutoff)
        if not result:
            result = queryset.filter(display_name__search=query)
        if not result:
            result = queryset.filter(display_name__unaccent__icontains=query)
        return result

    def active(self, when=None):
        active = Stint.objects.active(when).values_list(
            'contributor', flat=True
        )
        return self.filter(pk__in=active)

    def management(self):
        managers = Stint.objects.active().management().values_list(
            'contributor', flat=True
        )
        return self.filter(pk__in=managers)


class Contributor(TimeStampedModel, FuzzyNameSearchMixin, models.Model):
    """ Someone who contributes content to the newspaper or other staff. """

    objects = ContributorQuerySet.as_manager()

    UNKNOWN = 0
    ACTIVE = 1
    RETIRED = 2
    EXTERNAL = 3
    STATUS_CHOICES = [
        (UNKNOWN, _('Unknown')),
        (ACTIVE, _('Active')),
        (RETIRED, _('Retired')),
        (EXTERNAL, _('External')),
    ]
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    status = models.PositiveSmallIntegerField(
        choices=STATUS_CHOICES,
        default=UNKNOWN,
    )
    display_name = models.CharField(blank=False, max_length=50)
    aliases = models.TextField(blank=True)
    initials = models.CharField(blank=True, null=True, max_length=5)
    phone = models.CharField(blank=True, null=True, max_length=20)
    email = models.EmailField(blank=True, null=True)
    verified = models.BooleanField(
        help_text=_('Verified to be a correct name.'),
        default=False,
    )
    byline_photo = models.ForeignKey(
        'photo.ImageFile',
        related_name='person',
        blank=True,
        null=True,
        help_text=_('photo used for byline credit.'),
        on_delete=models.SET_NULL,
    )

    class Meta:
        verbose_name = _('Contributor')
        verbose_name_plural = _('Contributors')

    def __str__(self):
        return self.name

    @property
    def name(self):
        return self.display_name or self.initials or 'N. N.'

    def bylines_count(self):
        return self.byline_set.count()

    @cache_memoize(60 * 5)  # five minutes
    def thumb(self):
        img = self.byline_photo
        if not img:
            return None
        else:
            return img.preview.url

    @cache_memoize()
    def has_byline_image(self):
        return bool(self.byline_photo)

    @property
    def first_name(self):
        name_parts = self.display_name.split()
        if len(name_parts) > 1:
            name_parts.pop()
        return ' '.join(name_parts)

    @property
    def last_name(self):
        name_parts = self.display_name.split()
        return name_parts[-1]

    def legacy_data(self):
        """ Finds original byline in imported data. """
        data = []
        for story in self.story_set.all():
            web_source = story.legacy_html_source
            if web_source:
                byline = str(story) + ': '
                byline += json.loads(web_source)[0]['fields']['byline']
                data.append(byline)
        return '\n'.join(data)

    def get_user(self):
        """Get the user"""
        user = self.user
        if not user and self.email:
            user = User.objects.filter(email=self.email).first()
        if not user:
            user = User.objects.filter(
                first_name=self.first_name,
                last_name=self.last_name,
            ).first()
        return user

    def set_active(self, active=True, save=True):
        """Set contributor's status to `active` or `retired`"""
        if active and self.status != self.ACTIVE:
            self.status = self.ACTIVE
            if save:
                self.save()
        if not active and self.status != self.EXTERNAL:
            self.status = self.RETIRED
            if save:
                self.save()
        # if self.user and self.user.is_active != active:
        #     self.user.is_active = active
        #     if save:
        #         self.user.save()
        logger.debug('set %s as %s' % (self, self.get_status_display()))

    def add_to_groups(self):
        """Add user to groups based on active stints."""
        user = self.user
        if not user or self.status != self.ACTIVE:
            return False
        for stint in self.stint_set.active():
            groups = list(stint.position.groups.all())
            user.groups.add(*groups)
            logger.debug('added %s to %s' % (self, groups))
        return True

    @cache_memoize()
    def position(self):
        stints = self.stint_set.order_by(
            'position__is_management',
            'start_date',
        )

        if stints:
            stint = stints.active().last() or stints.last()
            return {
                'title': stint.position.title,
                'management': stint.position.is_management,
                'active': stint.is_active,
            }
        last_byline = self.byline_set.exclude(title=None).last()
        if last_byline:
            title = last_byline.title
        else:
            title = f'{self.get_status_display()} person'
        return {
            'title': title,
            'management': False,
            'active': False,
        }

    @property
    def title(self):
        return self.position()['title']

    @property
    def is_management(self):
        return self.position()['management']


class Position(models.Model):
    """ A postion or job in the publication. """

    title = models.CharField(
        verbose_name=_('title'),
        help_text=_('Job title at the publication.'),
        unique=True,
        max_length=50
    )
    is_management = models.BooleanField(
        verbose_name=_('is management'),
        help_text=_('Is this a management position'),
        default=False,
    )
    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        help_text=_('Implicit auth Group membership'),
    )
    active = models.BooleanField(
        default=True,
        verbose_name=_('active'),
        help_text=_('active'),
    )

    class Meta:
        verbose_name = _('Position')
        verbose_name_plural = _('Positions')

    def __str__(self):
        return '{}'.format(self.title)

    def active_stints(self, when=None):
        return Stint.objects.filter(position=self).active(when)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        groups = default_groups()

        if self.is_management:
            self.groups.add(groups.management)
            self.groups.remove(groups.staff)
        else:
            self.groups.remove(groups.management)


class StintQuerySet(models.QuerySet):
    def active(self, when=None):
        """ active stints today """
        when = when or today()
        return self.filter(start_date__lte=when).exclude(end_date__lt=when)

    def management(self, value=True):
        """ management stints """
        return self.filter(position__is_management=value)


class Stint(models.Model):
    """ The period a Contributor serves in a Position. """

    objects = StintQuerySet.as_manager()
    position = models.ForeignKey(
        Position,
        verbose_name=_('position'),
        on_delete=models.CASCADE,
    )
    contributor = models.ForeignKey(
        Contributor,
        verbose_name=_('contributor'),
        on_delete=models.CASCADE,
    )
    start_date = models.DateField(
        default=today,
        verbose_name=_('start date'),
    )
    end_date = models.DateField(
        blank=True,
        null=True,
        verbose_name=_('end date'),
    )

    def __str__(self):
        return (
            f'{self.position}: {self.contributor} '
            f'{self.start_date} – {self.end_date or ""}'
        )

    @property
    def is_active(self):
        return self.start_date <= today() <= (self.end_date or today())


@receiver(models.signals.post_save, sender=Stint)
def stint_changed(sender, instance, **kwargs):
    """cache buster"""
    instance.contributor.save()


@receiver(models.signals.pre_save, sender=Contributor)
def close_stints(sender, instance, **kwargs):
    """Make sure retired contributors have no active stints."""
    if not instance.pk:
        return
    previous_status = sender.objects.get(pk=instance.pk).status
    if previous_status == sender.ACTIVE and instance.status == sender.RETIRED:
        instance.stint_set.active().update(end_date=yesterday())
