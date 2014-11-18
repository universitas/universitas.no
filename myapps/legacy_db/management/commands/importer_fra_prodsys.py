from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from html.parser import HTMLParser
from pytz import datetime
import os
import re
import subprocess
from django.utils import timezone
from django.core.cache import cache
from django.conf import settings
from myapps.legacy_db.models import Bilde, Sak, Prodsak
from myapps.stories.models import Story, StoryType, Section, StoryImage, InlineLink
from myapps.photo.models import ImageFile
from myapps.issues.models import PrintIssue
from myapps.contributors.models import Contributor
from django.core import serializers
from optparse import make_option

BILDEMAPPE = os.path.join(settings.MEDIA_ROOT, '')

PDFMAPPE = os.path.join(settings.MEDIA_ROOT, 'pdf')
TIMEZONE = timezone.get_current_timezone()

import logging
logger = logging.getLogger('universitas')

from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = 'Imports content from legacy website.'
    option_list = BaseCommand.option_list + (
        make_option(
            '--first', '-f',
            type='int',
            dest='first',
            default=0,
            help='First article id to import'
        ),
        make_option(
            '--number', '-n',
            type='int',
            dest='number',
            default=0,
            help='Number of articles to import'
        ),
        make_option(
            '--reverse', '-r',
            action='store_true',
            dest='reverse',
            default=False,
            help='Start with newest articles.'
        ),
        make_option(
            '--nodrop', '-N',
            action='store_false',
            dest='drop',
            default=True,
            help='Don\'t rop old content from the database.'
        ),
        make_option(
            '--issues', '-i',
            action='store_true',
            dest='issues',
            default=False,
            help='Import issues'
        ),
    )

    def handle(self, *args, **options):

        if options['drop']:
            drop_images_stories_and_contributors()

        if options['issues']:
            importer_utgaver_fra_gammel_webside()

        order_by = '-id_sak' if options['reverse'] else 'id_sak'
        last = options['first'] + options['number'] if options['number'] else None

        importer_saker_fra_gammel_webside(first=options['first'], last=last, order_by=order_by)

        reset_db_autoincrement()
        self.stdout.write('Successfully imported content')


def importer_bilder_fra_gammel_webside(webbilder=None, limit=100):
    if not webbilder:
        webbilder = Bilde.objects.exclude(size="0").order_by('-id_bilde')
        if limit:
            # tilfeldige bilder for stikkprøvetesting.
            webbilder = webbilder.order_by('?')[:limit]
    else:
        webbilder = (webbilder,)

    # bildefiler = cache.get('bildefiler')
    # if not bildefiler:
    #     # Dette tar litt tid, så det caches i redis, som kan huske det mellom skriptene kjører.
    #     # TODO: Kanskje like raskt å bruke path.exists eller noe sånt?
    #     bildefiler = set(
    #         subprocess.check_output(
    #             'cd %s; find -iname "*.jp*g" | sed "s,./,,"' % (BILDEMAPPE,),
    #             shell=True,
    #         ).decode("utf-8").splitlines()
    #     )
    #     cache.set('bildefiler', bildefiler)

    for bilde in webbilder:
        path = bilde.path
        try:
            nyttbilde = ImageFile.objects.get(id=bilde.id_bilde)
        except ImageFile.DoesNotExist:
            fullpath = os.path.join(BILDEMAPPE, path)
            if os.path.isfile(fullpath):
                # bildet eksisterer på disk.

                modified = datetime.datetime.fromtimestamp(
                    os.path.getmtime(fullpath), TIMEZONE)
                created = datetime.datetime.fromtimestamp(
                    os.path.getctime(fullpath), TIMEZONE)
                dates = [modified, created, ]
                try:
                    saksdato = datetime.datetime.combine(bilde.sak.dato, datetime.time(tzinfo=TIMEZONE))
                    dates.append(saksdato)
                except ObjectDoesNotExist:
                    # ingen sak knyttet til dette bildet. Gå videre.
                    logger.debug('No prodak for {}'.format(bilde))
                    continue

                # Noen bilder har feil dato i fila.
                # Men for å unngå for mange feil, så regner vi med at bildet
                # senest kan ha blitt laget den dagen det ble publisert
                created = min(dates)

                try:
                    nyttbilde = ImageFile(
                        id=bilde.id_bilde,
                        old_file_path=path,
                        source_file=path,
                        created=created,
                        modified=modified,
                    )
                    nyttbilde.save()
                    logger.debug('    new image: {}'.format(path))
                except TypeError:
                    # Something wrong with the file?
                    nyttbilde = None
            else:
                nyttbilde = None
                # assert not (path in bildefiler)

    return nyttbilde


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
        year, issue = re.match(
            r'universitas_(?P<year>\d{4})-(?P<issue>.*)\.pdf$',
            filename,
        ).groups()
        logger.debug(
            'issue found {filename} #{issue} {year} ({date})'.format(
                filename=filename,
                date=created.strftime('%c'),
                year=year,
                issue=issue,
            )
        )
        if created.isoweekday() != 3:  # should be a Wednesday
            created = created + datetime.timedelta(days=3 - created.isoweekday())
        new_issue = PrintIssue(
            pdf=fullpath,
            pages=0,
            publication_date=created,
            issue_name=issue,
        )
        new_issue.save()


def importer_saker_fra_gammel_webside(first=0, last=None, order_by='id_sak'):
    websaker = Sak.objects.exclude(publisert=0).order_by(order_by)[first:last]
    for websak in websaker:
        prodsys_source = ''
        if Story.objects.filter(pk=websak.pk):
            logger.debug('sak %s finnes' % (websak.pk,))
            continue
        if websak.filnavn and websak.filnavn.isdigit():
            # Er hentet fra prodsys
            prodsak_id = int(websak.filnavn)
        else:
            # Gamle greier eller opprettet i nettavisa.
            prodsak_id = None
        try:
            prodsak = Prodsak.objects.filter(prodsak_id=prodsak_id).order_by('-version_no').first()
            prodsys_source = serializers.serialize('json', (prodsak,))
            xtags = clean_up_prodsys_encoding(prodsak.tekst)
            assert "Vellykket eksport fra InDesign!" in prodsak.kommentar
            assert "@tit:" in prodsak.tekst
            from_prodsys = True

        except (AttributeError, TypeError, AssertionError):
            xtags = websak_til_xtags(websak)
            from_prodsys = False

        xtags = clean_up_html(xtags)

        year, month, day = websak.dato.year, websak.dato.month, websak.dato.day
        publication_date = datetime.datetime(year, month, day, tzinfo=TIMEZONE)
        story_type = get_story_type(websak.mappe)

        if from_prodsys and Story.objects.filter(prodsak_id=prodsak_id).exists():
            # undersak har samme prodsak_id som hovedsak.
            new_story = Story.objects.get(prodsak_id=prodsak_id)

        else:
            new_story = Story(
                id=websak.id_sak,
                publication_date=publication_date,
                status=Story.STATUS_PUBLISHED,
                story_type=story_type,
                bodytext_markup=xtags,
                prodsak_id=prodsak_id,
                legacy_html_source=serializers.serialize('json', (websak,)),
                hit_count=websak.lesninger,
                legacy_prodsys_source=prodsys_source,
            )

            new_story.save()

        logger.debug('story saved: {} {}'.format(new_story, new_story.pk))

        for bilde in websak.bilde_set.all():
            try:
                caption = bilde.bildetekst.tekst
            except (ObjectDoesNotExist, AttributeError):
                caption = ''
            if caption:
                caption = clean_up_html(caption)
                caption = re.sub(r'^@[^:]+: ?', '', caption)
            image_file = importer_bilder_fra_gammel_webside(bilde)
            if image_file:
                story_image = StoryImage(
                    parent_story=new_story,
                    caption=caption[:1000],
                    creditline='',
                    published=bool(bilde.size),
                    imagefile=image_file,
                    size=bilde.size or 0,
                )
                story_image.save()

        new_story.save()

        # TODO: Tilsvarende import av bilder fra prodsakbilde.


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
        content.append('\n@fakta: {fakta}'.format(fakta=faktaboks.tekst
                                                  ))

    xtags = '\n'.join(content)
    return xtags


def clean_up_html(html):
    """
    Strips away html tags from input, or encodes appropriate xtags instead.
    string -> string
    """
    html = HTMLParser().unescape(html)
    replacements = (
        (r'\n*</', r'</', 0),  # trim newline before closing tag.
        (r'<\W*(br|p)[^>]*>', '\n', 0),  # <br> and <p> -> newlines.
        (r'</ *h[^>]*>', '\n', re.M),  # closing <h*> tags -> newline
        (r'<h[^>]*>', '\n@mt:', re.M),  # <h*> -> @mt: (subheadings)
        (r'  +', ' ', 0),  # trim multiple spaces.
        (r'\s*\n\s*', '\n', 0),  # trim trailing spaces and extra newlines.
        (r'<\W*(i|em) *>', '_', re.IGNORECASE),  # italic tags -> underscore
        (r'<\W*(b|strong) *>', '*', re.IGNORECASE),  # strong tags -> asterix
        (r'< *li *>', '\n@li:', re.IGNORECASE),  # list tags -> @li:
    )
    html = InlineLink.convert_html_links(html)
    for pattern, replacement, flags in replacements:
        html = re.sub(pattern, replacement, html, flags=flags)

    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html)
    html = soup.text

    return html


def clean_up_prodsys_encoding(text):
    """ Changes some strange (win 1252 ?) characters into proper unicode. """
    text = text.replace('\x92', '\'')  # some fixes for win 1252
    text = text.replace('\x95', '•')  # bullet
    text = text.replace('\x96', '–')  # n-dash
    text = text.replace('\x03', ' ')  # vetdafaen...
    return text


def reset_db_autoincrement():
    """ updates the next autoincrement value for primary keys in tables that have been
    populated using primary keys from legacy database."""
    from django.db import connection
    cursor = connection.cursor()
    cursor.execute("SELECT setval('photo_imagefile_id_seq', (SELECT MAX(id) FROM photo_imagefile)+1)")
    cursor.execute("SELECT setval('stories_story_id_seq', (SELECT MAX(id) FROM stories_story)+1)")
    cursor.execute("SELECT setval('django_migrations_id_seq', (SELECT MAX(id) FROM django_migrations)+1)")


def drop_images_stories_and_contributors():
    """ Empty tables before importing from legacy database """
    logger.debug('sletter images')
    ImageFile.objects.all().delete()
    logger.debug('sletter contributors')
    Contributor.objects.all().delete()
    logger.debug('sletter stories')
    Story.objects.all().delete()
