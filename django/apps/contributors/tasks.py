from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.exceptions import ObjectDoesNotExist
from utils.merge_model_objects import merge_instances

MANAGEMENT = 'mellomledere'
STAFF = 'redaksjon'


def add_contributor_to_groups(contributor):
    management, __ = Group.objects.get_or_create(name=MANAGEMENT)
    staff, __ = Group.objects.get_or_create(name=STAFF)
    active_stints = contributor.stint_set


def connect_contributor_to_user(contributor, create=False):
    """Connect contributor to user"""
    if contributor.user:
        return contributor.user
    user = contributor.get_user()
    if user:
        try:
            person = user.contributor
        except ObjectDoesNotExist:
            contributor.user = user
            contributor.save()
        else:
            merge_instances(contributor, person)
    elif create:
        user = get_user_model().create(
            username=contributor.email.split('@')[0].replace('.', '').lower(),
            email=contributor.email,
            first_name=contributor.first_name,
            last_name=contributor.last_name,
            active=True,
        )

    return user
