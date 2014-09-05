# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='imagefile',
            name='autocrop',
        ),
        migrations.AddField(
            model_name='imagefile',
            name='manual_crop',
            field=models.BooleanField(verbose_name='manual cropping', default=False, help_text='this image has been manually cropped'),
            preserve_default=True,
        ),
    ]
