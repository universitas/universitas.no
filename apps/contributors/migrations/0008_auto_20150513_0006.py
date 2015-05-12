# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '0007_auto_20150512_2314'),
    ]

    operations = [
        migrations.AddField(
            model_name='contributor',
            name='email',
            field=models.EmailField(blank=True, null=True, max_length=75),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='contributor',
            name='phone',
            field=models.CharField(blank=True, null=True, max_length=20),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='contributor',
            name='status',
            field=models.PositiveSmallIntegerField(default=0, choices=[(0, 'Unknown'), (1, 'Active'), (2, 'Retired'), (3, 'External')]),
            preserve_default=True,
        ),
    ]
