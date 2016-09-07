import re
from django.core.management.base import BaseCommand
from apps.stories.models import Story
import logging
logger = logging.getLogger(__name__)

LANGUAGE_CORPUS = {
    'nb': [
        'du',
        'og',
        'med',
        'om',
        'en',
        'et',
        'han',
        'hun',
        'ikke',
        'fra',
        'bare',
        'noe',
    ],
    'nn': [
        'du',
        'og',
        'med',
        'om',
        'ein',
        'eit',
        'han',
        'ho',
        'ikkje',
        'frå',
        'berre',
        'noko',
    ],
    'en': [
        'you',
        'and',
        'with',
        'a',
        'an',
        'he',
        'she',
        'not',
        'from',
        'only',
        'something',
    ],
}


class Command(BaseCommand):
    help = 'Assign language to all stories'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            dest='dry run',
            default=False,
            help='Dry run only'
        )

    def handle(self, *args, **options):

        dry_run = options['dry run']
        # stories = Story.objects.order_by('?')[:300]
        stories = Story.objects.all()

        def assign_language_to(story):
            """Guess and assign language to input story"""
            text = story.bodytext_markup
            language = guess_language(text)
            if language != story.language and not dry_run:
                story.language = language
                story.save()
            msg = '{pk} {title} ({language})'.format(
                title=story.title,
                pk=story.pk,
                language=story.language,
            )
            self.stdout.write(msg)

        def guess_language(text):
            """Guess language of input text by using a list of common words in
            candidate languages."""
            score = {key: 0 for key in LANGUAGE_CORPUS.keys()}
            words = re.findall(r'[a-zøæå]+', text.lower())

            for word in words:
                for language, words in LANGUAGE_CORPUS.items():
                    if word in words:
                        score[language] += 1
            return max(score, key=score.get)

        for story in stories:
            assign_language_to(story)
