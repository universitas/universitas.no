from optparse import make_option
import logging
logger = logging.getLogger(__name__)

from django.core.management.base import BaseCommand  # , CommandError

from apps.stories.models import Story

LANGUAGE_CORPUS = {
    'nb': [
        'en',
        'et',
        'han',
        'hun',
        'ikke',
        'fra',
        'bare',
        'noe',
        'selv',
        'mer',
        'sier'],
    'nn': [
        'ein',
        'eit',
        'han',
        'ho',
        'ikkje',
        'frå',
        'berre',
        'noko',
        'sjølv',
        'meir',
        'seier'],
    'en': [
        'a',
        'an',
        'he',
        'she',
        'not',
        'from',
        'only',
        'something',
        'self',
        'more',
        'says'],
}


class Command(BaseCommand):
    help = 'Assign language to all stories'
    option_list = BaseCommand.option_list + (
        make_option(
            '--dry-run',
            action='store_true',
            dest='dry run',
            default=False,
            help='Dry run only'
        ),
    )

    def handle(self, *args, **options):

        dry_run = options['dry run']
        # stories = Story.objects.order_by('?')[:300]
        stories = Story.objects.all()

        def assign_language_to(story):
            """Guess and assign language to input story"""
            text = story.get_plaintext()
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
            """Guess language of input text by using a list of common words in candidate languages."""
            score = {key: 0 for key in LANGUAGE_CORPUS.keys()}
            for word in text.split():
                for language, words in LANGUAGE_CORPUS.items():
                    if word in words:
                        score[language] += 1
            return max(score, key=score.get)

        for story in stories:
            assign_language_to(story)
