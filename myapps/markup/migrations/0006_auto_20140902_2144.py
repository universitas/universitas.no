# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('markup', '0005_auto_20140902_2140'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blocktag',
            name='start_tag',
            field=models.CharField(blank=True, default='', max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='inlinetag',
            name='start_tag',
            field=models.CharField(blank=True, default='', max_length=50, unique=True),
        ),
    ]
