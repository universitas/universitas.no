# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0002_auto_20140817_1507'),
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
    ]
