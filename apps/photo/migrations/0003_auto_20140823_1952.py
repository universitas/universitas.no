# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0002_auto_20140823_0149'),
    ]

    operations = [
        migrations.AlterField(
            model_name='imagefile',
            name='old_file_path',
            field=models.CharField(null=True, help_text='previous path if the image has been moved.', max_length=1000, blank=True),
        ),
    ]
