# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0005_auto_20151025_2003'),
    ]

    operations = [
        migrations.RenameField(
            model_name='imagefile',
            old_name='source_md5',
            new_name='_md5',
        ),
        migrations.RenameField(
            model_name='imagefile',
            old_name='source_size',
            new_name='_size',
        ),
        migrations.AddField(
            model_name='imagefile',
            name='_mtime',
            field=models.PositiveIntegerField(editable=False, verbose_name='mtime timestamp of source file', null=True),
        ),
    ]
