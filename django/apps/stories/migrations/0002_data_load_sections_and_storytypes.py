from pathlib import Path

from django.db import migrations
from utils.migration_helpers import load_fixture, unload_fixture

fixture = Path(__file__).parent / 'sections_and_story_types.json'


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(
            code=load_fixture(str(fixture)),
            reverse_code=unload_fixture('stories', ['Section', 'StoryType']),
        ),
    ]
