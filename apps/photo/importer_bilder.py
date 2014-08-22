import django
django.setup()

from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from pytz import datetime
import os
import re
import subprocess
from django.utils import timezone
from django.core.serializers import serialize
from django.conf import settings
from apps.legacy_db.models import Bilde, Prodbilde, Sak, Prodsak
from apps.stories.models import Story, StoryType, Section
from apps.photo.models import ImageFile
from apps.issues.models import PrintIssue

BILDEMAPPE = os.path.join(settings.MEDIA_ROOT, '')

PDFMAPPE = os.path.join(settings.MEDIA_ROOT, 'pdf')
TIMEZONE = timezone.get_current_timezone()


def importer_bilder_fra_gammel_webside(limit=100):
    webbilder = Bilde.objects.exclude(size="0").order_by('-id_bilde')
    if limit:
        webbilder = webbilder.order_by('?')[:limit]
    bildefiler = set(
        subprocess.check_output(
            'cd %s; find -iname "*.jp*g" | sed "s,./,,"' % (BILDEMAPPE,),
            shell=True,
        ).decode("utf-8").splitlines()
    )

    print('bildefiler: %s\nwebbilder: %s' % (len(bildefiler), webbilder.count()))
    for bilde in webbilder:
        # print(serializers.serialize('json', [bilde, ]))
        path = bilde.path
        filnavn = bilde.path.split('/')[-1]
        if path in bildefiler:
            # bildet eksisterer på disk.
            fullpath = os.path.join(BILDEMAPPE, path)

            modified = datetime.fromtimestamp(
                os.path.getmtime(fullpath), TIMEZONE)
            created = datetime.fromtimestamp(
                os.path.getctime(fullpath), TIMEZONE)

            if bilde.sak:
                saksdato = bilde.sak.dato
                created = min(saksdato, created, modified)

            nyttbilde = ImageFile(
                id=bilde.id_bilde,
                old_file_path=path,
                source_file=path,
                created=created,
                modified=modified,
            )
            nyttbilde.save()
            print(filnavn)
        else:
            print("finner ikke %s" % (path,))


def importer_utgaver_fra_gammel_webside():
    pdfer = set(
        subprocess.check_output(
            'cd %s; find -iname "*.pdf" | sed "s,./,,"' % (PDFMAPPE,),
            shell=True,
        ).decode("utf-8").splitlines()
    )
    for filename in pdfer:
        fullpath = os.path.join(PDFMAPPE, filename)
        created = datetime.date.fromtimestamp(
            os.path.getmtime(fullpath))
        year, issue = re.match(r'universitas_(?P<year>\d{4})-(?P<issue>.*)\.pdf$', filename).groups()
        print(filename, created.strftime('%c'), year, issue)
        if created.isoweekday() != 3:
            created = created + datetime.timedelta(days=3 - created.isoweekday())
        print(created.strftime('%c'))
        new_issue = PrintIssue(
            pdf = fullpath,
            pages = 0,
            publication_date = created,
            issue_name = issue,
            )
        new_issue.save()


def importer_saker_fra_gammel_webside():
    websaker = Sak.objects.order_by('?')[:10]
    for websak in websaker:
        if websak.filnavn and websak.filnavn.isdigit():
            prodsak_id = int(websak.filnavn)
        else:
            prodsak_id = None
        try:
            prodsak = Prodsak.objects.get(prodsak_id=prodsak_id)
            assert "Vellykket eksport fra InDesign!" in prodsak.kommentar
            xtags = clean_up_prodsys_encoding(prodsak.tekst)

        except (ObjectDoesNotExist, TypeError, AssertionError, ValueError) as e:
            xtags = websak_til_xtags(websak)

        xtags = clean_up_html(xtags)
        xtags = clean_up_xtags(xtags)
        # print(xtags)
        # print('\n\n')
        year, month, day = websak.dato.year, websak.dato.month, websak.dato.day
        publication_date = datetime.datetime(year, month, day, tzinfo=TIMEZONE)
        story_type = get_story_type(websak.mappe)

        new_story = Story(
            id=websak.id_sak,
            publication_date=publication_date,
            # dateline_date=websak.dato,
            status=Story.STATUS_PUBLISHED,
            story_type=story_type,
            bodytext_markup=xtags,
        )
        new_story.save()


def get_story_type(prodsys_mappe):
    try:
        story_type = StoryType.objects.get(prodsys_mappe=prodsys_mappe)
    except ObjectDoesNotExist:
        if Section.objects.count() == 0:
            Section.objects.create(title='Nyheter')
        story_type = StoryType.objects.create(
            prodsys_mappe=prodsys_mappe,
            name="New Story Type - " + prodsys_mappe,
            section=Section.objects.first(),
        )
    return story_type


def websak_til_xtags(websak):
    content = []
    fields = (
        (websak.overskrift, "tit"),
        (websak.ingress, "ing"),
        (websak.byline, "bl"),
    )
    for field, tag in fields:
        if field:
            content.append('@%s: %s\n' % (tag, field,))

    content.append('@txt:%s' % (websak.brodtekst.strip(),))

    if websak.sitat:
        quote = websak.sitat
        # sitatbyline er angitt med <em class="by">
        quote = re.sub(r'<.*class.*?>', '\n@sitatbyline:', quote)
        quote = re.sub(r'<.*?>', '\n', quote)
        content.append('@sitat:' + quote)

    if websak.subtittel1:
        # anmeldelsesfakta
        anmfakta = '\n@fakta: Anmeldelse'
        for punkt in (websak.subtittel1, websak.subtittel2, websak.subtittel3, websak.subtittel4):
            if punkt:
                anmfakta += '\n# %s' % (punkt,)
        content.append(anmfakta)

    for faktaboks in websak.fakta_set.all():
        content.append('\n@fakta: %s' % (
            clean_up_html(faktaboks.tekst),
        ))

    xtags = '\n'.join(content)
    return xtags


def clean_up_html(html):
    """ Fixes some characters and stuff in old prodsys implementation.
        string -> string
    """
    from html import parser
    html_parser = parser.HTMLParser()
    html = html_parser.unescape(html)
    replacements = (
        (r'\n*</', r'</', 0),
        (r'<\W*(br|p)[^>]*>', '\n', 0),
        (r'</ *h[^>]*>', '\n', re.M),
        (r'<h[^>]*>', '\n@mt:', re.M),
        (r'  +', ' ', 0),
        (r'\s*\n\s*', '\n', 0),
        (r'<\W*(i|em) *>', '_', re.IGNORECASE),
        (r'<\W*(b|strong) *>', '*', re.IGNORECASE),
        (r'< *li *>', '\n@li:', re.IGNORECASE),
        (r'<.*?>', '', 0),  # Alle andre html-tags blir fjernet.
    )

    for pattern, replacement, flags in replacements:
        html = re.sub(pattern, replacement, html, flags=flags)

    return html


def clean_up_prodsys_encoding(text):
    text = text.replace('\x92', '\'')  # some fixes for win 1252
    text = text.replace('\x95', '•')  # bullet
    text = text.replace('\x96', '–')  # n-dash
    return text


def clean_up_xtags(xtags):
    """ Fixes some characters and stuff in old prodsys implementation.
        string -> string
    """
    xtags = xtags.replace('@tit:', '@headline:', 1)
    replacements = (
        (r'^@mt:', '\n@mt:', re.M),
        (r'[–-]+', r'–', 0),
        (r'(\w)–', r'\1-', 0),
        (r'([,\w]) –(\w)', r'\1 -\2', 0),
        (r' - ', r' – ', 0),
        (r'["“”]', r'»', 0),
        (r'»\b', r'«', 0),
        (r'^# ?', '@li:', re.M),
        (r'^(\W*)\*([^*\n]*)\*', r'@tingo:\1\2', re.I + re.M),
        (r'^(\W*)[*_]([^_\n]*)[*_]$', r'@spm:\1\2', re.I + re.M),
        (r'(^|@[^:]+:) *- *', r'\1– ', 0),
        (r'^ *$', '', re.M),
        (r'^(@spm:)?[.a-z]+@[.a-z]+$', '', re.M),
    )

    for pattern, replacement, flags in replacements:
        xtags = re.sub(pattern, replacement, xtags, flags=flags)

    return xtags.strip()

importer_utgaver_fra_gammel_webside()
# importer_saker_fra_gammel_webside()
# importer_bilder_fra_gammel_webside()
# get_prodsaker()
