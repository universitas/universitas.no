# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0002_auto_20140905_1856'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='imagefile',
            name='manual_crop',
        ),
        migrations.AddField(
            model_name='imagefile',
            name='cropping_method',
            field=models.PositiveSmallIntegerField(default=0, choices=[(0, 'center'), (5, 'feature detection'), (10, 'face detection'), (100, 'manual crop')], help_text='How this image has been cropped.'),
            preserve_default=True,
        ),
    ]
