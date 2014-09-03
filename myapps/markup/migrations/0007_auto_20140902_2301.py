# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('markup', '0006_auto_20140902_2144'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='alias',
            options={'verbose_name': 'Alias', 'verbose_name_plural': 'Aliases'},
        ),
        migrations.AddField(
            model_name='alias',
            name='ordering',
            field=models.PositiveSmallIntegerField(default=1),
            preserve_default=True,
        ),
    ]
