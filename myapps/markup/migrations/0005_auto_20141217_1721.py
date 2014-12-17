# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('markup', '0004_auto_20141211_0724'),
    ]

    operations = [
        migrations.AlterField(
            model_name='alias',
            name='timing',
            field=models.PositiveSmallIntegerField(choices=[(1, 'import'), (2, 'extra'), (3, 'bylines'), (4, 'clean')], default=1),
        ),
    ]
