""" Contributors to the thing """

import os
from slugify import Slugify
import glob
import re
import json

from fuzzywuzzy import fuzz

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.contrib.auth.models import Group
from django.core.files import File

from apps.photo.models import ProfileImage
import logging
logger = logging.getLogger(__name__)


def today():
    return timezone.now().date()


class Contributor(models.Model):

    """ Someone who contributes content to the newspaper or other staff. """

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

    # user = models.ForeignKey(User, blank=True, null=True)
    status = models.PositiveSmallIntegerField(
        choices=STATUS_CHOICES,
        default=UNKNOWN,
    )
    display_name = models.CharField(blank=True, max_length=50)
    aliases = models.TextField(blank=True)
    initials = models.CharField(blank=True, null=True, max_length=5)
    phone = models.CharField(blank=True, null=True, max_length=20)
    email = models.EmailField(blank=True, null=True)
    verified = models.BooleanField(
        help_text=_('Verified to be a correct name.'),
        default=False,
    )
    byline_photo = models.ForeignKey(
        ProfileImage,
        related_name='person',
        blank=True, null=True,
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

    def get_byline_image(self, force_new=False):
        slugify = Slugify()
        if not force_new and self.byline_photo:
            return self.byline_photo
        imagefiles = glob.glob(
            os.path.join(settings.BYLINE_PHOTO_DIR, '*.jpg'))
        name = self.name
        name_last_first = re.sub(r'^(.*) (\S+)$', r'\2 \1', name)
        name_slug_title = slugify(name) + '.jpg'
        name_slug = name_slug_title.lower()
        name_slug_reverse = slugify(name_last_first).lower() + '.jpg'
        bestratio = 90
        bestmatch = None
        for path in imagefiles:
            filename = os.path.split(path)[1].lower()
            ratio = max(
                fuzz.ratio(filename, name_slug),
                fuzz.ratio(filename, name_slug_reverse)
            )
            if ratio > bestratio:
                bestmatch = path
                bestratio = ratio
                if ratio == 100:
                    break
        if bestmatch:
            msg = 'found match: name:{}, img:{}, ratio:{} '.format(
                name_slug, bestmatch, ratio)
            logger.debug(msg)
            with open(bestmatch, 'rb') as source:
                content = File(source)
                img = ProfileImage()
                img.source_file.save(name_slug_title, content)
            self.byline_photo = img
            self.save()
            return img

    # @cached(3600)
    def has_byline_image(self):
        return bool(self.get_byline_image())

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

    @classmethod
    def get_or_create(cls, input_name, initials=''):
        """
        Fancy lookup for low quality legacy imports.
        Tries to avoid creation of multiple contributor instances
        for a single real contributor.
        """
        full_name = re.sub('\(.*?\)', '', input_name)[:50].strip()
        if not full_name:
            return []
        names = full_name.split()
        last_name = names[-1]
        first_name = ' '.join(names[:-1][:1])
        # middle_name = ' '.join(names[1:-1])
        # logger.debug('"%s", "%s", "%s"' % (first_name, last_name, full_name))
        base_query = cls.objects

        def find_single_item_or_none(func):
            """ Decorator to return one item or none by catching exceptions """

            def inner_func(*args, **kwargs):
                try:
                    return func(*args, **kwargs)
                except ObjectDoesNotExist:
                    # lets' try something else.
                    return None
                except MultipleObjectsReturned:
                    # TODO: Make sure two people can have the same name.
                    return None
            return inner_func

        @find_single_item_or_none
        def search_for_full_name():
            return base_query.get(display_name=full_name)

        @find_single_item_or_none
        def search_for_first_plus_last_name():
            if not first_name:
                return None
            return base_query.get(
                display_name__istartswith=first_name,
                display_name__iendswith=last_name)

        @find_single_item_or_none
        def search_for_alias():
            if first_name:
                return None
            return base_query.get(aliases__icontains=last_name)

        def fuzzy_search():
            MINIMUM_RATIO = 85
            candidates = []
            for contributor in base_query.all():
                ratio = fuzz.ratio(contributor.display_name, full_name)
                if ratio >= MINIMUM_RATIO:
                    # TODO: two contributors with same name.
                    return contributor
                if contributor.display_name in full_name:
                    candidates.append(contributor)
            return candidates or None

        # Variuous queries to look for contributor in the database.
        contributor = (
            search_for_full_name() or
            search_for_first_plus_last_name() or
            fuzzy_search() or
            None
            # search_for_alias() or
            # search_for_initials() or
        )

        if isinstance(contributor, list):
            combined_byline = ' '.join([c.display_name for c in contributor])
            ratio = fuzz.token_sort_ratio(combined_byline, full_name)
            msg = 'ratio: {ratio} {combined} -> {full_name}'.format(
                ratio=ratio, combined=combined_byline, full_name=full_name,)
            logger.debug(msg)
            if ratio >= 80:
                return contributor
            else:
                contributor = None

        # Was not found with any of the methods.
        if not contributor:
            contributor = cls(
                display_name=full_name[:50].strip(),
                initials=initials[:5].strip(),
            )
            contributor.save()

        if contributor.display_name != full_name:

            # Misspelling or different combination of names.
            contributor.aliases += '\n' + input_name
            contributor.save()

        return [contributor]


# class ContactInfo(models.Model):

#     """
#     Contact information for contributors and others.
#     """

#     PERSON = _('Person')
#     INSTITUTION = _('Institution')
#     POSITION = _('Position')
#     CONTACT_TYPES = (
#         ("Person", PERSON),
#         ("Institution", INSTITUTION),
#         ("Position", POSITION),
#     )

#     name = models.CharField(blank=True, null=True, max_length=200)
#     title = models.CharField(blank=True, null=True, max_length=200)
#     postal_address = models.CharField(blank=True, null=True, max_length=200)
#     street_address = models.CharField(blank=True, null=True, max_length=200)
#     webpage = models.URLField()
#     contact_type = models.CharField(choices=CONTACT_TYPES, max_length=50)

#     class Meta:
#         verbose_name = _('ContactInfo')
#         verbose_name_plural = _('ContactInfo')

#     def __unicode__(self):
#         return self.name


class Position(models.Model):

    """ A postion or job in the publication. """

    title = models.CharField(
        help_text=_('Job title at the publication.'),
        unique=True, max_length=50)

    groups = models.ManyToManyField(
        Group,
        help_text=_('Group membership'),
    )

    class Meta:
        verbose_name = _('Position')
        verbose_name_plural = _('Positions')

    def __str__(self):
        return '{}'.format(self.title)

    def active(self, when=None):
        if when is None:
            when = today()
        results = Stint.objects.filter(
            position=self, start_date__gte=when
        ).exclude(end_date__lt=when)
        return results


class Stint(models.Model):

    """ The period a Contributor serves in a Position. """

    position = models.ForeignKey(Position)
    contributor = models.ForeignKey(Contributor)
    start_date = models.DateField(
        default=today,
    )
    end_date = models.DateField(
        blank=True, null=True
    )

    def __str__(self):
        return '{} {}'.format(self.position, self.contributor)
