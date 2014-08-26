# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import sorl.thumbnail.fields


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '0001_initial'),
        ('photo', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='imagefile',
            name='contributor',
            field=models.ForeignKey(help_text='who made this.', blank=True, to='contributors.Contributor', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='imagefile',
            name='copyright_information',
            field=models.CharField(max_length=1000, null=True, help_text='If needed.', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='imagefile',
            name='source_file',
            field=sorl.thumbnail.fields.ImageField(upload_to='upload/', height_field='full_height', width_field='full_width', max_length=1024),
        ),
    ]
