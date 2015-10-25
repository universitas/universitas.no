# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0004_auto_20151014_0004'),
    ]

    operations = [
        migrations.AddField(
            model_name='imagefile',
            name='source_md5',
            field=models.CharField(max_length=32, editable=False, null=True, verbose_name='md5 hash of source file'),
        ),
        migrations.AddField(
            model_name='imagefile',
            name='source_size',
            field=models.PositiveIntegerField(editable=False, null=True, verbose_name='size of file in bytes'),
        ),
    ]
