# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('markup', '0007_auto_20140902_2301'),
    ]

    operations = [
        migrations.AddField(
            model_name='inlinetag',
            name='pattern',
            field=models.CharField(max_length=200, blank=True, default=''),
            preserve_default=True,
        ),
    ]
