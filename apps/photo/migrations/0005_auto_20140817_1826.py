# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0004_auto_20140817_1530'),
    ]

    operations = [
        migrations.AddField(
            model_name='imagefile',
            name='full_height',
            field=models.PositiveIntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='imagefile',
            name='full_width',
            field=models.PositiveIntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='imagefile',
            name='source_file',
            field=models.ImageField(width_field='full_width', height_field='full_height', upload_to='upload/'),
        ),
    ]
