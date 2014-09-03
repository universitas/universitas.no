# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('markup', '0009_inlinetag_replacement'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='alias',
            options={'ordering': ('ordering',), 'verbose_name_plural': 'Aliases', 'verbose_name': 'Alias'},
        ),
        migrations.AddField(
            model_name='alias',
            name='comment',
            field=models.TextField(default='explain this pattern'),
            preserve_default=True,
        ),
    ]
