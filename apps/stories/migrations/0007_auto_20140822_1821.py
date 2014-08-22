# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0006_aside_pullquote_storyimage'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='prodsystag',
            options={'verbose_name': 'prodsys tag', 'verbose_name_plural': 'prodsys tags'},
        ),
        migrations.AlterField(
            model_name='story',
            name='prodsak_id',
            field=models.PositiveIntegerField(editable=False, null=True, blank=True, help_text='Id in the prodsys database.'),
        ),
    ]
