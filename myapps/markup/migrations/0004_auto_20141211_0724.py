# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('markup', '0003_auto_20141211_0505'),
    ]

    operations = [
        migrations.AlterField(
            model_name='alias',
            name='comment',
            field=models.CharField(max_length=1000, default='explain this pattern', blank=True),
        ),
    ]
