# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models, migrations


def make_frontpage(apps, schema_editor):
    Frontpage = apps.get_model('frontpage', 'Frontpage')
    if Frontpage.objects.count() == 0:
        f = Frontpage(label='front')
        f.save()


def backwards(apps, schema_editor):
    Frontpage = apps.get_model('frontpage', 'Frontpage')
    Frontpage.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('frontpage', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(
            make_frontpage,
            reverse_code=backwards,
        ),
    ]
