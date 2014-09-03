# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('markup', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='prodsystag',
            old_name='xtag',
            new_name='start_tag',
        ),
        migrations.AddField(
            model_name='prodsystag',
            name='end_tag',
            field=models.CharField(blank=True, default='', max_length=50),
            preserve_default=True,
        ),
    ]
