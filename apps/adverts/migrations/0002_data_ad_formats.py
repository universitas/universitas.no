# -*- coding: utf-8 -*-
from django.db import models, migrations
from django.core.management import call_command

FIXTURE = 'ad_formats'

def load_fixture(apps, schema_editor):
    call_command('loaddata', FIXTURE, app_label='adverts')


def unload_fixture(apps, schema_editor):
    MyModel = apps.get_model('adverts', 'AdFormat')
    MyModel.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('adverts', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(load_fixture, reverse_code=unload_fixture),
    ]
