from pathlib import Path

from django.db import migrations

from utils.migration_helpers import load_fixture, unload_fixture

fixture = Path(__file__).parent / 'pub-plan-2010-2015.json'


def renumber(apps, schema_editor):
    """Set correct issue numbering"""
    # Issue = apps.get_model('issues', 'Issue')
    from apps.issues.models import Issue
    Issue.objects.renumber()


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0010_auto_20160924_2128'),
    ]

    operations = [
        migrations.RunPython(
            code=load_fixture(str(fixture)),
            reverse_code=unload_fixture('issues', ['Issue', 'PrintIssue']),
        ),
        migrations.RunPython(renumber, renumber),
    ]
