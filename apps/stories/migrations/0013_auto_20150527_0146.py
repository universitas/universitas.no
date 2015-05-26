# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0012_auto_20150527_0113'),
    ]

    operations = [
        migrations.AlterField(
            model_name='storyimage',
            name='aspect_ratio',
            field=models.FloatField(choices=[(0.0, 'auto'), (0.4, '5:2 landscape'), (0.5, '2:1 landscape'), (0.6666666666666666, '3:2 landscape'), (0.75, '4:3 landscape'), (1.0, 'square'), (1.3333333333333333, '3:4 portrait'), (1.5, '2:3 portrait'), (2.0, '1:2 portrait'), (100.0, 'original')], default=0.0, verbose_name='aspect ratio', help_text='height / width'),
        ),
        migrations.AlterField(
            model_name='storyvideo',
            name='aspect_ratio',
            field=models.FloatField(choices=[(0.0, 'auto'), (0.4, '5:2 landscape'), (0.5, '2:1 landscape'), (0.6666666666666666, '3:2 landscape'), (0.75, '4:3 landscape'), (1.0, 'square'), (1.3333333333333333, '3:4 portrait'), (1.5, '2:3 portrait'), (2.0, '1:2 portrait'), (100.0, 'original')], default=0.0, verbose_name='aspect ratio', help_text='height / width'),
        ),
    ]
