# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models, migrations
import os
from django.core import serializers

fixture_dir = os.path.dirname(__file__)
fixture_filename = 'sections_and_story_types.json'


def load_fixture(apps, schema_editor):
    from django.core.management import call_command

    def load_fixture(apps, schema_editor):
        call_command('loaddata', fixture_filename, app_label='stories')
    # fixture_file = os.path.join(fixture_dir, fixture_filename)

    # fixture = open(fixture_file, 'rb')
    # objects = serializers.deserialize('json', fixture, ignorenonexistent=True)
    # for obj in objects:
    #     obj.save()
    # fixture.close()


def unload_fixture(apps, schema_editor):
    "Brutally deleting all entries for this model..."
    for modelname in ('Section', 'StoryType'):
        model = apps.get_model('stories', modelname)
        model.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0002_auto_20141217_1841'),
    ]

    operations = [
        migrations.RunPython(
            load_fixture,
            reverse_code=unload_fixture,
        ),
    ]
