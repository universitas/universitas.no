from datetime import date, datetime
import logging
import re
from typing import Dict, Iterable, List, Optional, Union  # noqa

from django.db.models.query import QuerySet
from django.utils import timezone

from apps.issues.models import PrintIssue
from utils.merge_model_objects import merge_instances

from .models import Contributor, Position, Stint

STAFF_TITLES = (r'daglig leder', r'\w*redaktør', r'\w*leder', r'\w*sjef')
MINIMUM_DATE = timezone.datetime(2000, 1, 1)
StaffData = Dict[str, str]
Time = Union[str, date, datetime]
logger = logging.getLogger(__name__)


def create_stints_from_pdfs(since: datetime = None, dry_run=False):
    """Find and create managemnt stints from pdf texts"""
    print_issues = PrintIssue.objects.all()
    if since:
        print_issues = print_issues.filter(issue__publication_date__gte=since)

    for print_issue in print_issues:
        text = _get_content(print_issue)
        staff_data = _find_staff(text)
        date = print_issue.issue.publication_date
        logger.debug(
            f'{date} {print_issue}\n' +
            f'\n'.join(f'{k}: {v}' for k, v in staff_data.items())
        )
        if dry_run:
            continue
        for title, name in staff_data.items():
            _add_to_stint(title, name, date)


def create_stints_from_bylines(dry_run=False, since=MINIMUM_DATE):
    """Find dates, bylines and names and create stints"""
    for title, credit in [
        ('journalist', 'text'),
        ('fotograf', 'photo'),
        ('oversetter', 'translation'),
        ('illustratør', 'illustration'),
    ]:
        position, _ = Position.objects.get_or_create(title=title)
        _add_stints_from_bylines(
            position=position,
            credit=credit,
            exclude_sections=('Debatt'),
            byline_cutoff=1,
            since=since,
            dry_run=dry_run
        )


def _add_stints_from_bylines(
    position: Position,
    credit: str,
    exclude_sections: List[str] = [],
    byline_cutoff: int = 0,
    dry_run: bool = False,
    since: Time = MINIMUM_DATE,
):
    """Add stints based on byline credits"""
    recent_contributors = Contributor.objects.filter(
        byline__story__publication_date__gte=since,
        byline__credit__contains=credit,
    )

    for person in recent_contributors:
        if person.is_management:
            continue
        bylines = person.byline_set.filter(
            credit__contains=credit,
            story__publication_date__gte=since,
        ).exclude(  # no opinion pieces
            story__story_type__section__title__in=exclude_sections
        ).order_by(
            'story__publication_date'
        )
        if bylines.count() <= byline_cutoff:
            continue  # ignore people with few bylines
        first_byline = bylines.first().story.publication_date.date()
        last_byline = bylines.last().story.publication_date.date()

        if Stint.objects.filter(
            contributor=person,
            position=position,
            start_date__lte=first_byline,
        ).exclude(
            end_date__lt=last_byline,
        ).exists():
            continue

        stint = Stint(
            start_date=first_byline,
            end_date=last_byline,
            contributor=person,
            position=position,
        )
        two_weeks_ago = timezone.now() - timezone.timedelta(days=14)
        if two_weeks_ago.date() < stint.end_date:
            stint.end_date = None  # no end date for current stint
        logger.debug(f'{stint} {bylines.count()}')
        if dry_run:
            continue
        stint.save()
        # merge with any existing stints for the same person and position


def merge_stints(
    stints: QuerySet, max_gap=timezone.timedelta(days=180)
) -> Stint:
    """Merge one or more Stints"""
    last: Optional[Stint] = None
    for stint in stints:
        if (
            last and (last.contributor,
                      last.position) == (stint.contributor, stint.position)
            and max_or_none(
                last.end_date,
                stint.start_date - max_gap,
            ) == last.end_date
        ):
            last.start_date = min(stint.start_date, last.start_date)
            last.end_date = max_or_none(stint.end_date, last.end_date)
            last.save()
            last = merge_instances(last, stint)
        else:
            last = stint


def _find_staff(text: str, titles: Iterable[str] = STAFF_TITLES) -> StaffData:
    """Find editorial staff names from colophones in extracted pdf text."""

    pattern = (r'^(?P<title>' f'({"|".join(titles)})' r'):\s*(?P<name>.+)$')
    regex = re.compile(pattern, flags=re.M | re.I)
    # pdf might contain non printing characters, such as backspace
    text = text.replace('\x08', '')
    matches = regex.finditer(text)
    return {
        d['title'].lower().strip(): d['name'].strip()
        for d in [m.groupdict() for m in matches]
    }


def _get_content(print_issue: PrintIssue, first_page=2, last_page=999) -> str:
    """Get full text of a pdf issue"""
    try:
        return print_issue.get_page_text_content(first_page, last_page)
    except Exception as e:
        logger.exception('Error reading pdf:')
        return ''


def max_or_none(*vals):
    try:
        return max(*vals)
    except TypeError:
        return None


def _add_to_stint(title: str, name: str, date: date) -> Stint:
    """Create or update a Stint so that the date is included in the period."""
    contributor = Contributor.objects.active(date).filter(display_name=name
                                                          ).first()
    if not contributor:
        contributor, created = Contributor.get_or_create(name)
        action = "created" if created else "found"
        logger.warning(f'could not find "{name}" => {action} "{contributor}"')
    position, _ = Position.objects.get_or_create(title=title)
    defaults = {'start_date': date, 'end_date': date}
    stint, _ = Stint.objects.get_or_create(
        defaults=defaults, position=position, contributor=contributor
    )
    stint.end_date = max_or_none(stint.end_date, date)
    stint.start_date = min(stint.start_date, date)
    stint.save()
    return stint
