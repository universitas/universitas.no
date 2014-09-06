# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('markup', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='alias',
            name='timing',
            field=models.PositiveSmallIntegerField(choices=[(1, 'import'), (2, 'extra'), (3, 'bylines'), (4, 'template')], default=1),
        ),
    ]
