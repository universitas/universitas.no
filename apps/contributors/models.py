from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

class Contributor(models.Model):

    """ Someone who contributes content to the newspaper or other staff. """

    # TODO: Implement foreignkeys to positions, user and contact_info
    # user = models.ForeignKey(User, blank=True, null=True)
    # position = models.ForeignKey('Position')
    # contact_info = models.ForeignKey('ContactInfo')
    displayName = models.CharField(blank=True, max_length=50)
    aliases = models.TextField(blank=True)
    initials = models.CharField(blank=True, null=True, max_length=5)

    class Meta:
        verbose_name = _('Contributor')
        verbose_name_plural = _('Contributors')

    def __str__(self):
        return self.displayName or self.initials or 'N. N.'

    @classmethod
    def get_or_create(cls, full_name, initials=''):
        """
        Fancy lookup for low quality legacy imports.
        Tries to avoid creation of multiple contributor instances
        for a single real contributor.
        """
        names = full_name.split()
        last_name = names[-1]
        first_name = names[:-1][:1]
        # middle_name = ' '.join(names[1:-1])

        base_query = cls.objects

        def find_single_item_or_none(func):
            """ Decorator to return one item or none """

            def inner_func(*args, **kwargs):
                try:
                    return func(*args, **kwargs)
                except ObjectDoesNotExist:
                    # lets' try something else.
                    return None
                except MultipleObjectsReturned:
                    # We pass this error on for now.
                    # TODO: Make sure two people can have the same name.
                    raise
            return inner_func

        @find_single_item_or_none
        def search_for_full_name():
            return base_query.get(displayName=full_name)

        @find_single_item_or_none
        def search_for_first_plus_last_name():
            if not first_name:
                return None
            return base_query.get(
                displayName__istartswith=first_name,
                displayName__iendswith=last_name)

        @find_single_item_or_none
        def search_for_alias():
            if first_name:
                return None
            return base_query.get(aliases__icontains=last_name)

        @find_single_item_or_none
        def search_for_initials():
            if first_name or not initials:
                return None
            contributor = base_query.get(initials__iexact=initials)
            # TODO: contributor addalias(newalias-maybe).
            # TODO: contributor merge.
            # TODO: two contributors with same name.
            contributor.aliases += full_name
            contributor.save()
            return contributor

        # Variuous queries to look for contributor in the database.
        contributor = (
            search_for_full_name() or
            search_for_alias() or
            search_for_initials() or
            None
        )

        # Was not found with any of the methods.
        if not contributor:
            contributor = cls(
                displayName=full_name[:50],
                initials=initials,
            )
            contributor.save()
        return contributor


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
        verbose_name_plural = _('ContactInfo')

    def __str__(self):
        return self.name


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
