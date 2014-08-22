# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0002_remove_story_related_stories'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='story',
            name='prodsys_id',
        ),
        migrations.RemoveField(
            model_name='story',
            name='prodsys_json',
        ),
        migrations.AddField(
            model_name='story',
            name='prodsak_id',
            field=models.PositiveIntegerField(help_text='Id in the prodsys database.', blank=True, null=True),
            preserve_default=True,
        ),
    ]
