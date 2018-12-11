import logging

# from allauth.account.models import EmailAccount
from allauth.exceptions import ImmediateHttpResponse
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from django.utils.translation import ugettext_lazy as _

from apps.contributors.models import Contributor
from apps.contributors.tasks import connect_contributor_to_user

logger = logging.getLogger(__name__)

User = get_user_model()


def get_instance(Model, *lookups):
    """Helper function to search for model instance by a cascade of lookups"""
    for kwargs in lookups:
        qs = Model.objects.filter(**kwargs)
        try:
            return qs.get()
        except Model.MultipleObjectsReturned:
            return qs.last()
        except Model.DoesNotExist:
            pass


class AutoConnectSocialAccountAdapter(DefaultSocialAccountAdapter):
    """Automatically link facebook account to matching django user."""
    unknown_user = ('Could not find an active staff member with name %(name)s')
    not_verified = (
        'The facebook user %(name)s is not verified.\n'
        'Please log in with username and password.'
    )

    def pre_social_login(self, request, sociallogin):
        """Invoked just after a user successfully authenticates via a social
        provider, but before the login is actually processed (and before the
        pre_social_login signal is emitted).

        You can use this hook to intervene, e.g. abort the login by raising an
        ImmediateHttpResponse Why both an adapter hook and the signal?
        Intervening in e.g. the flow from within a signal handler is bad --
        multiple handlers may be active and are executed in undetermined
        order."""

        # Ignore existing social accounts, just do this stuff for new ones
        if sociallogin.is_existing:
            return

        # some social logins don't have an email address, e.g. facebook
        # accounts with mobile numbers only, but allauth takes care of this
        # case so just ignore it

        data = sociallogin.account.extra_data
        email = data.get('email').lower()
        name = data.get('name')
        verified = data.get('verified')

        if not all([email, name, verified]):
            msg = _(self.not_verified) % {'name': name, 'email': email}
            messages.error(request, msg)
            raise ImmediateHttpResponse(redirect('prodsys'))

        contributor = get_instance(
            Contributor, dict(status=Contributor.ACTIVE, email=email),
            dict(status=Contributor.ACTIVE, display_name=name)
        )
        if contributor:
            user = connect_contributor_to_user(contributor, create=True)
        else:
            user = get_instance(User, dict(email=email))

        if not user:
            msg = _(self.unknown_user) % {'name': name, 'email': email}
            messages.error(request, msg)
            raise ImmediateHttpResponse(redirect('prodsys'))

        user.email = email
        if not user.get_full_name():
            user.first_name = data.get('first_name')
            user.last_name = data.get('last_name')
        user.save()

        return sociallogin.connect(request, user)
