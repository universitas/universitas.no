from functools import wraps
import glob
import logging
import os
import re

from django.conf import settings
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from fuzzywuzzy import fuzz
from slugify import Slugify

logger = logging.getLogger(__name__)


def find_single_item_or_none(fn):
    """ Decorator to return one item or none by catching exceptions """

    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except ObjectDoesNotExist:
            return None
        except MultipleObjectsReturned:
            # TODO: Make sure two people can have the same name.
            return None

    return wrapper


class FuzzyNameSearchMixin:
    """Mixin for Contributor with some long and hacky methods for fuzzy finding
    byline photo image files and for connecting possibly misspelled bylines"""

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

        @find_single_item_or_none
        def search_for_full_name():
            return base_query.get(display_name=full_name)

        @find_single_item_or_none
        def search_for_first_plus_last_name():
            if not first_name:
                return None
            return base_query.get(
                display_name__istartswith=first_name,
                display_name__iendswith=last_name
            )

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
            search_for_full_name() or search_for_first_plus_last_name()
            or fuzzy_search() or None
            # search_for_alias() or
            # search_for_initials() or
        )

        if isinstance(contributor, list):
            combined_byline = ' '.join([c.display_name for c in contributor])
            ratio = fuzz.token_sort_ratio(combined_byline, full_name)
            msg = 'ratio: {ratio} {combined} -> {full_name}'.format(
                ratio=ratio,
                combined=combined_byline,
                full_name=full_name,
            )
            logger.debug(msg)
            if ratio >= 80:
                return contributor
            else:
                contributor = None

        # Was not found with any of the methods.
        created = False
        if not contributor:
            created = True
            contributor = cls(
                display_name=full_name[:50].strip(),
                initials=initials[:5].strip(),
            )
            contributor.save()

        if contributor.display_name != full_name:

            # Misspelling or different combination of names.
            contributor.aliases += '\n' + input_name
            contributor.save()

        return (contributor, created)
