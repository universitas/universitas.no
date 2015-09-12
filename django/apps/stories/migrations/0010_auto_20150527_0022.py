# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0009_auto_20150430_1413'),
    ]

    operations = [
        migrations.AddField(
            model_name='storyimage',
            name='aspect_ratio',
            field=models.FloatField(choices=[(0, 'auto'), (0.5, '1:2 landscape'), (0.75, '3:4 landscape'), (1.0, 'square'), (1.3333333333333333, '4:3 portrait'), (2.0, '2:1 portrait'), (-1, 'original')], default=0, help_text='height / width', verbose_name='aspect ratio'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='storyvideo',
            name='aspect_ratio',
            field=models.FloatField(choices=[(0, 'auto'), (0.5, '1:2 landscape'), (0.75, '3:4 landscape'), (1.0, 'square'), (1.3333333333333333, '4:3 portrait'), (2.0, '2:1 portrait'), (-1, 'original')], default=0, help_text='height / width', verbose_name='aspect ratio'),
            preserve_default=True,
        ),
    ]
