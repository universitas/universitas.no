"""Tasks for issues and pdfs"""
import logging

from celery.schedules import crontab
from celery.task import periodic_task
from django.db.models import Avg, F, Func
from django.db.models.expressions import Random

from .models import FrontpageStory

logger = logging.getLogger(__name__)

FOUR_O_CLOCK = crontab(hour=4, minute=0)


def randomize_priority(qs, min=-10, max=10):
    """Sets random priority"""
    qs.update(priority=Random() * (max - min) + min)


def round_priority(qs, precision=1):
    """Rounds priority to precision"""
    factor = 10**precision
    qs.update(priority=Func(F('priority') * factor, function='ROUND') / factor)


@periodic_task(run_every=FOUR_O_CLOCK)
def normalize_priority():
    """Resets frontpagestory priorities"""
    items = FrontpageStory.objects.all()
    top = items.filter(id__in=items.with_ranking()[:50])
    bottom = items.exclude(id__in=top)
    bottom.update(priority=0)
    avg = round(top.aggregate(avg=Avg('priority'))['avg'])
    top.update(priority=F('priority') - avg)
    round_priority(top)
