# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import sorl.thumbnail.fields


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0003_auto_20140823_1952'),
    ]

    operations = [
        migrations.AlterField(
            model_name='imagefile',
            name='source_file',
            field=sorl.thumbnail.fields.ImageField(upload_to='', height_field='full_height', max_length=1024, width_field='full_width'),
        ),
    ]
