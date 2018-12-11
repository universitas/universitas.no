import logging

from celery.schedules import crontab
from celery.task import periodic_task

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from utils.merge_model_objects import merge_instances

from .calculate_stints import (
    create_stints_from_bylines,
    create_stints_from_pdfs,
)
from .models import Contributor, default_groups

User = get_user_model()
logger = logging.getLogger(__name__)

ONE_HUNDRED_DAYS = timezone.now() - timezone.timedelta(days=100)
TWO_WEEKS = timezone.now() - timezone.timedelta(days=14)
FIVE_O_CLOCK = crontab(hour=5, minute=0)

# Time since last published byline before setting someone as 'inactive'
ACTIVE_CUTOFF = getattr(settings, 'ACTIVE_CUTOFF', ONE_HUNDRED_DAYS)


@periodic_task(run_every=FIVE_O_CLOCK)
def daily_update():
    create_stints_from_bylines(since=TWO_WEEKS)
    create_stints_from_pdfs(since=TWO_WEEKS)
    update_status()


def connect_contributor_to_user(cn: Contributor, create=False):
    """Connect contributor to user"""
    if cn.user:
        return cn.user
    user = cn.get_user()
    groups = default_groups()
    if user:
        logger.info(f'found {user}')
        try:
            person = user.contributor
        except ObjectDoesNotExist:
            cn.user = user
            cn.save()
        else:
            merge_instances(cn, person)
    elif create:
        if not cn.email:
            logger.warning('Cannot create user for %s without an email' % cn)
            return None
        username = cn.email.split('@')[0].replace('.', '').lower()
        usernamebase = username
        n = 1
        while User.objects.filter(username=username):
            username = f'{usernamebase}{n}'
        user = User.objects.create_user(
            username=username,
            email=cn.email,
            first_name=cn.first_name,
            last_name=cn.last_name,
            is_active=True,
        )
        user.groups.add(groups.staff)
        logger.info(f'created {user}')
    return user


def update_contributor_status(cn: Contributor):
    """Check if cn is active, add to groups if needed"""
    stints = cn.stint_set
    if stints.active():
        is_active = True
        cn.user = cn.get_user()
        if cn.user and not cn.is_management and cn.user.last_login:
            is_active = cn.user.last_login > ACTIVE_CUTOFF
            if not is_active:
                cn.stint_set.active().update(end_date=cn.user.last_login)
                cn.set_active(False)
                return
        cn.add_to_groups()
        cn.set_active(True)
    elif not stints.filter(end_date__gt=ACTIVE_CUTOFF):
        cn.set_active(False)


def update_status():
    """Check if any contributors have become inactive and update active
    contributors"""
    for cn in Contributor.objects.exclude(status=Contributor.EXTERNAL):
        update_contributor_status(cn)
