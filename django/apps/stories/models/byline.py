import difflib
import json
import logging
import re

from diff_match_patch import diff_match_patch

from apps.contributors.models import Contributor
from django.db import models
from django.utils.translation import ugettext_lazy as _

logger = logging.getLogger(__name__)
bylines_logger = logging.getLogger('bylines')


def needle_in_haystack(needle, haystack):
    """ strips away all spaces and puctuations before comparing. """
    needle = re.sub(r'\W', '', needle).lower()
    diff = diff_match_patch()
    diff.Match_Distance = 5000  # default is 1000
    diff.Match_Threshold = .5  # default is .5
    lines = haystack.splitlines()
    for line in lines:
        line2 = re.sub(r'\W', '', line).lower()
        value = diff.match_main(line2, needle, 0)
        if value is not -1:
            return line
    return 'no match in %d lines' % (len(lines), )


class BylineManager(models.Manager):
    def ordered(self):
        return self.order_by('ordering', 'pk')


class Byline(models.Model):
    """ Credits the people who created content for a story. """

    CREDIT_CHOICES = [
        ('by', _('By')),
        ('text', _('Text')),
        ('video', _('Video')),
        ('photo', _('Photo')),
        ('video', _('Video')),
        ('illustration', _('Illustration')),
        ('graphics', _('Graphics')),
        ('translation', _('Translation')),
        ('text and photo', _('TextPhoto')),
        ('text and video', _('TextVideo')),
        ('photo and video', _('PhotoVideo')),
    ]
    DEFAULT_CREDIT = CREDIT_CHOICES[0][0]
    objects = BylineManager()
    story = models.ForeignKey('Story')
    contributor = models.ForeignKey(Contributor)
    ordering = models.IntegerField(default=1)
    credit = models.CharField(
        choices=CREDIT_CHOICES,
        default=DEFAULT_CREDIT,
        max_length=20,
    )
    title = models.CharField(
        blank=True,
        null=True,
        max_length=200,
    )

    class Meta:
        verbose_name = _('Byline')
        verbose_name_plural = _('Bylines')

    def __str__(self):
        return '@bl: {credit}: {full_name}{title}'.format(
            credit=self.get_credit_display(),
            full_name=self.contributor,
            title='' if not self.title else f', {self.title}',
        )

    @classmethod
    def create(cls, full_byline, story, initials=''):
        """
        Creates new user or tries to find existing name in db
        args:
            full_byline: string of byline and creditline
            article: Article object (must be saved)
            initials: string
        returns:
            Byline object
        """
        byline_pattern = re.compile(
            # single word credit with colon. Person's name, Person's job title
            # or similiar description.
            # Example:
            # text: Jane Doe, Just a regular person
            r'^(?P<credit>[^:]+): (?P<full_name>[^,]+)\s*(, (?P<title>.+))?$',
            flags=re.UNICODE,
        )

        match = byline_pattern.match(full_byline)
        full_name = None
        try:
            d = match.groupdict()
            full_name = d['full_name'].title()
            title = d['title'] or ''
            credit = d['credit'].lower()
            initials = ''.join(
                letters[0] for letters in full_name.replace('-', ' ').split()
            )
            assert initials == initials.upper(
            ), 'All names should be capitalised'
            assert len(
                initials
            ) <= 5, 'Five names probably means something is wrong.'
            if len(initials) == 1:
                initials = full_name.upper()

        except (
            AssertionError,
            AttributeError,
        ) as e:
            # Malformed byline
            p_org = w_org = ' -- '
            if story.legacy_prodsys_source:
                dump = story.legacy_prodsys_source
                tekst = json.loads(dump)[0]['fields']['tekst']
                p_org = needle_in_haystack(full_byline, tekst)
            if story.legacy_html_source:
                dump = story.legacy_html_source
                w_org = json.loads(dump)[0]['fields']['byline']

            warning = ((
                'Malformed byline: "{byline}" error: {error} id: {id}'
                ' p_id: {p_id}\n{p_org} | {w_org} '
            ).format(
                id=story.id,
                p_id=story.prodsak_id,
                # story=story,
                byline=full_byline,
                error=e,
                p_org=p_org,
                w_org=w_org,
            ))
            logger.warn(warning)
            story.comment += warning
            story.publication_status = story.STATUS_ERROR

            full_name = 'Nomen Nescio'
            title = full_byline
            initials = 'XX'
            credit = '???'

        for choice in cls.CREDIT_CHOICES:
            # Find correct credit.
            ratio = difflib.SequenceMatcher(
                None,
                choice[0],
                credit[:],
            ).ratio()
            if .4 > ratio > .8:
                logger.debug(choice[0], credit, ratio)
            if ratio > .8:
                credit = choice[0]
                break
        else:
            credit = cls.DEFAULT_CREDIT

        contributor, __ = Contributor.get_or_create(full_name, initials)

        new_byline = cls(
            story=story,
            credit=credit,
            title=title[:200],
            contributor=contributor,
        )
        new_byline.save()


def clean_up_bylines(raw_bylines):
    """
    Normalise misformatting and idiosyncraticies of bylines in legacy data.
    string -> string
    """
    replacements = (
        # email addresses will die!
        (r'\S+@\S+', '', 0),

        # Symbols used to separate individual bylines.
        (r'[\r\n]+|\s*[;♦∙•Ï·]\s*| [-–*#] |/', r'\n', re.I),

        # remove underscores and asterisks.
        (r'[_*]', '', 0),

        # Credit with colon must be at the beginning of a line.
        (r' +((?:foto|video|photo|text|tekst|illus|graf)\w+):', r'\n\1', re.I),

        # "and" or "og" before two capitalised words probably means it's
        # a new person. Insert newline.
        (r'\s+([oO]g\s|[aA]nd\s)\s*([A-ZÆØÅ]\S+ [A-ZÆØÅ])', r'\nditto:\2', 0),

        # student, Universitet -> student ved Universitet
        (r'(student), ([A-Z])', r'\1 ved \2', 0),

        # uncapitalized word, comma and two capitalized words probably means a
        # new person.
        (r'( [a-zæøå)(]+), ([A-ZÆØÅ]\S+ [A-ZÆØÅd])', r'\1\n\2', 0),

        # TODO: Bytt ut byline regular expression med ny regex-modul som funker
        # med unicode

        # parantheses shall have no spaces inside them, but after and before.
        (r' *\( *(.*?) *\) *', r' (\1)\n', 0),

        # close parantheses.
        (r'(\([^)]+)$', r'\1)', re.M),

        # words in parantheses at end of line is probably some creditation.
        # Put in front with colon instead.
        # (r'^(.*?) *\(([^)]*)\) *$', r'\2: \1', re.M),
        (
            r'^(.*?) *\((\w*(?:fot|vid|pho|tex|tek|ill|gra)[^)]*)\) *$',
            r'\2: \1', re.M | re.I
        ),

        # Oversatt = translation
        (r'^(oversatt av|translated by):? ', 'translation: ', re.I | re.M),

        # "Anmeldt av" is text credit.
        (r'^anmeldt av:?', '', re.I | re.M),

        # skrevet av = text
        (r'^(skrevet )?(av|by|ved):?', '', re.I | re.M),

        # ... og foto
        (r'og foto:?', 'and photo:', re.I),
        (r'og video:?', 'and video:', re.I),
        (r'og tekst:?', 'and text:', re.I),

        # Any word containging "photo" is some kind of photo credit.
        (r'^ *\w*(ph|f)oto\w*:?', '\nphoto:', re.I | re.M),

        # Any word containing "text" is text credit.
        (r'^ *\w*te(ks|x)t\w*:?', '\ntext:', re.I | re.M),

        # These words are stripped from end of line.
        (r' *(,| og| and) *$', '', re.M | re.I),

        # These words are stripped from start of line
        (r'^ *(,|og |and |av ) *', '', re.M | re.I),

        # These words are stripped from after colon
        (r': *(,|og |and |av ) *', ':', re.M | re.I),

        # Creditline with empty space after it is deleted.
        (r'^\S:\s*$', '', re.M),

        # Multiple spaces.
        (r' {2,}', ' ', 0),

        # Remove lines containing only whitespace.
        (r'\s*\n\s*', r'\n', 0),

        # Bylines with no credit are generic.
        (r'^([^:\n]{5,20})$', r'by:\1', re.M),
        (r'^([^:\n]{20})', r'by:\1', re.M),

        # Exactly one space after and no space before colon or comma.
        (r'\s*([:,])+\s*', r'\1 ', 0),

        # No multi colons
        (r': *:', r':', 0),

        # No random colons at the start or end of a line
        (r'^\s*:', r'', re.M),
        (r':\s*$', r'', re.M),

        # No full stops at end of a line.
        (r'\.$', r' ', 0),

        # Two credits become one
        (r'^(\w+): (\w+):', r'\1 and \2:', re.M),
        (r': ?and ', r' and ', 0),

        # Somewhere!
        (r': (i|på) (\S+): (.*)$', r': \3, \1 \2', re.M | re.I),

        # Ditto credit
        (r'(^(.+?:).+\n)ditto:', r'\1\2', re.M | re.I),
        (r' and ditto:', ':', re.I),
    )

    byline_words = []

    for word in raw_bylines.split():
        byline_words.append(word)

    bylines = ' '.join(byline_words)

    for pattern, replacement, flags in replacements[:]:
        bylines = re.sub(pattern, replacement, bylines, flags=flags)
    bylines = bylines.strip()
    if 'photo:' in bylines:
        bylines = bylines.replace('by:', 'text:')

    bylines_logger.info('("%s",\n"%s"),' % (raw_bylines, bylines))
    return bylines
