# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import model_utils.fields
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('frontpage', '0002_remove_frontpagestory_image'),
        ('photo', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='image',
            name='image_file',
        ),
        migrations.RemoveField(
            model_name='image',
            name='photographer',
        ),
        migrations.DeleteModel(
            name='Image',
        ),
        migrations.AddField(
            model_name='imagefile',
            name='created',
            field=model_utils.fields.AutoCreatedField(verbose_name='created', editable=False, default=django.utils.timezone.now),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='imagefile',
            name='modified',
            field=model_utils.fields.AutoLastModifiedField(verbose_name='modified', editable=False, default=django.utils.timezone.now),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='imagefile',
            name='source_file',
            field=models.ImageField(height_field='full_height', width_field='full_width', upload_to='/srv/local.universitas.no/static/INCOMING'),
        ),
    ]
