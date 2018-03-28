
from pathlib import Path
from django.db import migrations
from utils.migration_helpers import unload_fixture, load_fixture

fixture = Path(__file__).parent / 'sections_and_story_types.json'


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0002_auto_20141217_1841'),
    ]

    operations = [
        migrations.RunPython(
            code=load_fixture(str(fixture)),
            reverse_code=unload_fixture('stories', ['Section', 'StoryType']),
        ),
    ]
