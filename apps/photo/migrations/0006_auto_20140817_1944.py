# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0005_auto_20140817_1826'),
    ]

    operations = [
        migrations.AlterField(
            model_name='imagefile',
            name='full_height',
            field=models.PositiveIntegerField(editable=False),
        ),
        migrations.AlterField(
            model_name='imagefile',
            name='full_width',
            field=models.PositiveIntegerField(editable=False),
        ),
        migrations.AlterField(
            model_name='imagefile',
            name='source_file',
            field=models.ImageField(width_field='full_width', height_field='full_height', upload_to='upload/', max_length=1024),
        ),
    ]
