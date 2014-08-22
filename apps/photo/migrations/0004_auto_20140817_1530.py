# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0003_auto_20140817_1513'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='imagefile',
            name='full_height',
        ),
        migrations.RemoveField(
            model_name='imagefile',
            name='full_width',
        ),
        migrations.AlterField(
            model_name='imagefile',
            name='source_file',
            field=models.ImageField(upload_to='/srv/local.universitas.no/static'),
        ),
    ]
