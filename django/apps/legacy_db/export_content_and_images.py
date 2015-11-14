# -*- coding: utf-8 -*-
# pylint: disable=logging-format-interpolation
"""
Export content from old website and the
production system to the new website.
"""

import os
import errno
import re
from datetime import datetime, date, time
# from html.parser import HTMLParser
from html import unescape
from bs4 import BeautifulSoup
# from PyPDF2 import PdfFileReader

from django.utils import timezone
from django.conf import settings
from django.db import connection
from django.core import serializers

from apps.legacy_db.models import (
    Sak, Prodsak, Bildetekst, Prodbilde)
from apps.stories.models import (
    Story, StoryType, Section, StoryImage, InlineLink)
from apps.photo.models import ImageFile, upload_image_to
from slugify import Slugify
slugify_filename = Slugify(safe_chars='.-', separator='-')

# from apps.contributors.models import Contributor
# BILDEMAPPE = os.path.join(MEDIA_ROOT, '')
# PDFMAPPE = os.path.join(MEDIA_ROOT, 'pdf')
STAGING_FOLDER = os.path.join(settings.STAGING_ROOT, 'STAGING', 'IMAGES')

import logging
logger = logging.getLogger(__name__)
count = 0


def make_sure_path_exists(path):
    try:
        os.makedirs(path)
    except OSError as exception:
        if exception.errno != errno.EEXIST:
            raise


def reset_db_autoincrement():
    """
    updates the next autoincrement value for primary keys in tables that
    have been populated using primary keys from legacy database.
    """
    cursor = connection.cursor()
    tables = [
        'photo_imagefile',
        'stories_story',
        'stories_storytype',
        'django_migrations']
    sql_pattern = (
        "SELECT setval('{table}_id_seq'"
        ", (SELECT MAX(id) FROM {table})+1)"
    )

    for table_name in tables:
        query = sql_pattern.format(table=table_name)
        logger.debug(query)
        cursor.execute(query)


def drop_model_tables(*models):
    """ Empty tables before importing from legacy database """
    for model in models:
        logger.debug('sletter {model_label}'.format(model_label=model.__name__))
        model.objects.all().delete()


def import_legacy_website_content(
        first=0,
        last=None,
        reverse=False,
        text_only=False,
        replace_existing=False,
        autocrop=False):
    """ Import old content from legacy website. """
    order_by = 'id_sak' if not reverse else '-id_sak'
    websaker = Sak.objects.exclude(publisert=0).order_by(order_by)[first:last]
    for websak in websaker:

        if replace_existing:
            this_story = Story.objects.filter(pk=websak.pk)
            if this_story.exists():
                logger.debug('sak %s finnes' % (websak.pk,))
                this_story.delete()

        new_story = _importer_websak(websak)
        if not text_only:
            _importer_bilder_fra_webside(websak, new_story, autocrop)
        new_story.full_clean()
        new_story.save(new=not text_only)

    return len(websaker)


def import_prodsys_content(
        first=0,
        last=None,
        reverse=False,
        replace_existing=False,
        text_only=False,
        autocrop=False):
    """ Import all new stories from prodsys. """
    status = [Prodsak.READY_FOR_WEB, ]
    # status = list(range(Prodsak.READY_FOR_WEB, Prodsak.ARCHIVED))

    prodsak_ids = Prodsak.objects.filter(
        produsert__in=status).values_list(
        'prodsak_id', flat=True)
    prodsak_ids = sorted(set(prodsak_ids), reverse=reverse)

    logger.info('Found {} stories to import'.format(len(prodsak_ids)))

    import_images = not text_only
    for prodsak_id in prodsak_ids:
        _importer_prodsak(prodsak_id, replace_existing, autocrop, import_images)
        Prodsak.objects.filter(
            prodsak_id=prodsak_id,
            # produsert__in=status
        ).update(produsert=Prodsak.PUBLISHED_ON_WEB)

    return len(prodsak_ids)


def _importer_websak(websak):
    """ Import a single story from legacy website. """
    global count
    count += 1

    # check if story exists
    try:
        old_story = Story.objects.get(id=websak.id_sak)
        logger.warn(
            '{:>5} story already exists: {} {}'.format(
                count,
                old_story,
                old_story.pk))
        return old_story
    except Story.DoesNotExist:
        pass

    # check whether this story has a parent story
    try:
        new_websak = Sak.objects.get(undersak=websak.pk)
        logger.warn(
            '{:>5} Has parent: {} {}'.format(
                count,
                new_websak.pk,
                websak.pk))
        return _importer_websak(new_websak)
    except Sak.DoesNotExist:
        pass
    except Sak.MultipleObjectsReturned:
        if websak.pk == 0:
            pass

    new_story = Story(
        id=websak.id_sak,
        publication_date=_make_aware(websak.dato),
        story_type=_get_story_type(websak.mappe),
        legacy_html_source=serializers.serialize('json', (websak,)),
        hit_count=websak.lesninger,
    )

    try:
        prodsak_id = int(websak.filnavn)
    # No integer prodsak_id means that this article does not exist in prodsys.
    except (TypeError, ValueError):
        prodsak_id = None

    new_story.prodsak_id = prodsak_id

    try:  # import this story from prodsys
        prodsak = _get_xtags_from_prodsys(
            prodsak_id=prodsak_id,
            status_in=[
                Prodsak.READY_FOR_WEB,
                Prodsak.PUBLISHED_ON_WEB,
                Prodsak.ARCHIVED,
            ])
    except Prodsak.DoesNotExist:  # couldn't find the story in prodsys
        pass
    else:
        new_story.bodytext_markup = prodsak[0]
        new_story.publication_status = prodsak[1]
        new_story.prodsys_json = prodsak[2]

    if new_story.publication_status != Story.STATUS_PUBLISHED:
        # prodsys story cannot be used for import.
        # It was not found, never existed, or is malformed.
        # create xtags from the legacy website story instead.
        new_story.bodytext_markup = _websak_til_xtags(websak)
        new_story.publication_status = Story.STATUS_PUBLISHED
        if websak.undersak:
            try:
                undersak = Sak.objects.get(pk=websak.undersak)
                xtags = _websak_til_xtags(undersak).replace(
                    '@tit:',
                    '@undersaktit:')
                new_story.bodytext_markup += '\n' + xtags
                logger.debug(
                    'undersak: {} len:{}'.format(
                        websak.undersak,
                        len(xtags)))
            except Sak.DoesNotExist:
                # Dangling reference in database.
                pass
    new_story.save()
    new_story.clean()
    new_story.save()
    logger.debug(
        '{:>5} story saved: {} {}'.format(
            count,
            new_story,
            new_story.pk))
    return new_story


def _importer_prodsak(
        prodsak_id,
        replace_existing=False,
        autocrop=False,
        import_images=True):
    """
    Create a Story with images from a prodsak object in the prodsys database.
    """
    # Check if this story has been imported already.
    exists = Story.objects.filter(prodsak_id=prodsak_id)
    if exists:
        if replace_existing:
            exists.delete()
        else:
            return

    # Create a new Story.
    xtags, status, json, prodsak = _get_xtags_from_prodsys(prodsak_id)
    story_type = _get_story_type(prodsak.mappe)
    new_story = Story(
        prodsak_id=prodsak_id,
        bodytext_markup=xtags,
        story_type=story_type,
        publication_status=status,
        legacy_prodsys_source=json,
    )
    new_story.save()
    logger.debug('story saved: {} {}'.format(new_story, new_story.pk))

    # Import images from prodsys to the new Story.
    if import_images:
        _importer_bilder_fra_prodsys(prodsak, new_story, autocrop)

    new_story.full_clean()
    new_story.save(new=True)

    # Update the prodsys object if needed.
    # if prodsak.produsert == Prodsak.READY_FOR_WEB:
    #     prodsak.produsert = Prodsak.PUBLISHED_ON_WEB
    #     prodsak.kommentar = (
    #         prodsak.kommentar or '') + '\n\n Importert til nettside'
    #     prodsak.save()
    #     logger.debug('prodsak updated: {}'.format(prodsak))


def _get_xtags_from_prodsys(prodsak_id, status_in=None):
    """ Get cleaned xtag from a story in the prodsys database. """
    filters = {'prodsak_id': prodsak_id}
    if status_in:
        filters.update(produsert__in=status_in)

    # Find the correct story in the database.
    story_versions = Prodsak.objects.filter(**filters)
    final_version = story_versions.latest('version_no')

    # Check whether the story has been edited in InDesign.
    if "Vellykket eksport fra InDesign!" in (
            final_version.kommentar or '') and '@tit' in (
            final_version.tekst or ''):
        status = Story.STATUS_READY
    else:
        status = Story.STATUS_DRAFT

    # Prepare content data.
    json = serializers.serialize('json', (final_version,))
    xtags = _clean_up_prodsys_encoding(final_version.tekst or '')
    xtags = _clean_up_html(xtags)

    return (xtags, status, json, final_version)


def _importer_bilder_fra_prodsys(prodsak, story, autocrop):
    """ Import all images connected to a single story. """
    prod_bilder = Prodbilde.objects.filter(prodsak_id=prodsak.prodsak_id)

    for bilde in prod_bilder:
        story_image = None
        # Prepare the image caption.
        caption = bilde.bildetekst or ''
        caption = _clean_up_html(caption)
        caption = re.sub(r'^@[^:]+: ?', '', caption)  # strip xtag.

        # Make the ImageFile and StoryImage objects.
        image_file = _create_image_file(filepath=bilde.bildefil, prodsys=True)

        if image_file:
            published = bool(bilde.prioritet)
            story_image = StoryImage(
                parent_story=story,
                imagefile=image_file,
                index=0 if published else None,
                size=bilde.prioritet or 0,
                creditline='',
                caption=caption[:1000],
            )
            story_image.save()
            if autocrop:
                image_file.autocrop()

        # logger.debug(story_image)


def _importer_bilder_fra_webside(websak, story, autocrop):
    """ Import all images connected to a single story. """
    for bilde in websak.bilde_set.all():
        # Prepare the caption.
        try:
            caption = bilde.bildetekst.tekst
            caption = _clean_up_html(caption)
            caption = re.sub(r'^@[^:]+: ?', '', caption)  # strip tag.
        except (Bildetekst.DoesNotExist, AttributeError):
            caption = ''

        # Make the ImageFile object.
        image_file = _create_image_file(
            filepath=bilde.path,
            publication_date=websak.dato,
            pk=bilde.id_bilde,
        )

        # Make the StoryImage object.
        if image_file:
            published = bool(bilde.size)
            story_image = StoryImage(
                parent_story=story,
                imagefile=image_file,
                index=0 if published else None,
                size=bilde.size or 0,
                creditline='',
                caption=caption[:1000],
            )
            story_image.save()
            if autocrop:
                image_file.autocrop()


def _create_image_file(filepath, publication_date=None, pk=None, prodsys=False):
    """ Create an ImageFile object from a filepath. """
    current_filepath = upload_image_to(ImageFile, os.path.basename(filepath))

    existing_image = (
        ImageFile.objects.filter(pk=pk) |
        ImageFile.objects.filter(source_file=filepath) |
        ImageFile.objects.filter(source_file=current_filepath)
    )
    try:
        image = existing_image.get()
        logger.debug('found image: %s' % image)
        return image
    except ImageFile.DoesNotExist:
        pass

    # Check that the file exists on the harddrive.
    if prodsys:
        staging_image = os.path.join(STAGING_FOLDER, filepath)

        if not os.path.isfile(staging_image):
            logger.warn('image not found: %s' % staging_image)
            return None

        creation_time = _make_aware(
            datetime.fromtimestamp( os.path.getmtime( staging_image ) ) )

        if publication_date:
            publication_datetime = _make_aware(publication_date)
            creation_time = min(creation_time, publication_datetime)

        image_file = ImageFile.objects.create_from_file(
            pk=pk,
            filepath=staging_image,
            created=creation_time
        )
        logger.debug('New image file created: %s' % image_file)
        return image_file

    return None


def _make_aware(time_input):
    """ Convert naive date object into timezone aware datetime. """
    if type(time_input) == date:
        time_input = datetime.combine(time_input, time())
    return timezone.make_aware(
        time_input, timezone=timezone.get_current_timezone())


def _get_story_type(prodsys_mappe):
    """ Find correct story type for the story based on legacy label. """
    try:
        story_type = StoryType.objects.filter(prodsys_mappe=prodsys_mappe)[0]
    except IndexError:
        generic_section, exists = Section.objects.get_or_create(
            title='New Section')
        story_type = StoryType.objects.create(
            prodsys_mappe=prodsys_mappe,
            name="New Story Type ({label})".format(label=prodsys_mappe),
            section=generic_section,
        )
    # finally:
    return story_type


def _websak_til_xtags(websak):
    """ Convert legacy article on website into tagged text. """
    content_list = []

    def main(websak):
        """Construct an xtags string from relevant fields in websak model. """
        # Add content to the content list.
        xtags_header_title_and_bylines()
        # TODO: HTML entiteter i <bylin></bylin>es blir ikke fikset under import
        xtags_body_text()
        xtags_pull_quotes()
        xtags_review_aside()
        xtags_fact_asides()

        # Create a string and convert html into xtags.
        xtags = '\n'.join(content_list)
        xtags = _clean_up_html(xtags)

        return xtags

    def xtags_header_title_and_bylines():
        header_fields = (
            (websak.overskrift, "tit"),
            (websak.temaord, "tema"),
            (websak.ingress, "ing"),
            (websak.byline, "bl"),
        )
        for field_content, tag in header_fields:
            if not field_content is None and field_content.strip():
                field_content = re.sub(r'\s+', ' ', field_content)
                content_list.append('@{}: {}\n'.format(tag, field_content))

    def xtags_body_text():
        content_list.append(
            '@txt:{text_content}'.format(text_content=websak.brodtekst.strip())
        )

    def xtags_pull_quotes():
        if websak.sitat:
            quote = websak.sitat
            # sitatbyline er angitt med <em class="by">
            quote = re.sub(r'<.*class.*?>', '\n@sitatbyline:', quote)
            # remove html tags
            quote = re.sub(r'<.*?>', '\n', quote)
            content_list.append(
                '@sitat:{quote}'.format(quote=quote)
            )

    def xtags_review_aside():
        if websak.subtittel1:
            content_list.append('\n@fakta: Anmeldelse')
            for item in (
                    websak.subtittel1,
                    websak.subtittel2,
                    websak.subtittel3,
                    websak.subtittel4):
                if item:
                    content_list.append(
                        '# {text_content}'.format(
                            text_content=item))

    def xtags_fact_asides():
        for aside in websak.fakta_set.all():
            content_list.append(
                '\n@fakta: {text_content}'.format(text_content=aside.tekst)
            )

    return main(websak)


def _clean_up_html(html):
    """
    Strips away html tags from input, or encodes appropriate xtags instead.
    string -> string
    """
    replacements = (  # pattern, replacement, flags - for use with re.sub()
        (r'\n*</', r'</', 0),  # trim newline before closing tag.
        (r'<\W*(br|p)[^>]*>', '\n', 0),  # <br> and <p> -> newlines.
        (r'</ *h[^>]*>', '\n', re.MULTILINE),  # closing <h*> tags -> newline
        (r'<h[^>]*>', '\n@mt:', re.MULTILINE),  # <h*> -> @mt: (subheadings)
        (r'  +', ' ', 0),  # trim multiple spaces.
        (r'\s*\n\s*', '\n', 0),  # trim trailing spaces and extra newlines.
        (r'<\W*(i|em) *>', '_', re.IGNORECASE),  # italic tags -> underscore
        (r'<\W*(b|strong) *>', '*', re.IGNORECASE),  # strong tags -> asterix
        (r'< *li *>', '\n@li:', re.IGNORECASE),  # list tags -> @li:
    )

    # Convert html entities into unicode.
    html = unescape(html)

    # Convert <a href=''> links into InlineLink objects. Insert reference
    # strings in source instead.
    html = InlineLink.convert_html_links(html, return_html=True)

    # Search and replace regular expressions.
    for pattern, replacement, flags in replacements:
        html = re.sub(pattern, replacement, html, flags=flags)

    # Remove final html fragments.
    soup = BeautifulSoup(html)
    html = soup.text

    return html


def _strip_xtags(text):
    """ Strip xtags from input text. """
    return re.sub('^@\S+?:', '', text, re.MULTILINE)


def _clean_up_prodsys_encoding(text):
    """
    Changes some strange (win 1252 ?) characters in
    legacy data into proper unicode.
    """
    text = text.replace('\x92', '\'')  # some fixes for win 1252
    text = text.replace('\x95', '•')  # bullet
    text = text.replace('\x96', '–')  # n-dash
    text = text.replace('\x03', ' ')  # vetdafaen...
    return text
