# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0014_auto_20150527_0200'),
    ]

    operations = [
        migrations.AlterField(
            model_name='storyimage',
            name='aspect_ratio',
            field=models.FloatField(verbose_name='aspect ratio', help_text='height / width', default=0.0, choices=[(0.0, 'auto'), (0.4, '5:2 landscape'), (0.5, '2:1 landscape'), (0.667, '3:2 landscape'), (0.75, '4:3 landscape'), (1.0, 'square'), (1.333, '3:4 portrait'), (1.5, '2:3 portrait'), (2.0, '1:2 portrait'), (100.0, 'original')]),
        ),
        migrations.AlterField(
            model_name='storyvideo',
            name='aspect_ratio',
            field=models.FloatField(verbose_name='aspect ratio', help_text='height / width', default=0.0, choices=[(0.0, 'auto'), (0.4, '5:2 landscape'), (0.5, '2:1 landscape'), (0.667, '3:2 landscape'), (0.75, '4:3 landscape'), (1.0, 'square'), (1.333, '3:4 portrait'), (1.5, '2:3 portrait'), (2.0, '1:2 portrait'), (100.0, 'original')]),
        ),
    ]
