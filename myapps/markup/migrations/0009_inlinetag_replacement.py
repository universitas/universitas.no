# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('markup', '0008_inlinetag_pattern'),
    ]

    operations = [
        migrations.AddField(
            model_name='inlinetag',
            name='replacement',
            field=models.CharField(blank=True, max_length=200, default=''),
            preserve_default=True,
        ),
    ]
