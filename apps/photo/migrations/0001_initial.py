# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import model_utils.fields
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(editable=False, verbose_name='created', default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, verbose_name='modified', default=django.utils.timezone.now)),
                ('photographer', models.ForeignKey(to='contributors.Contributor')),
            ],
            options={
                'verbose_name_plural': 'Images',
                'verbose_name': 'Image',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ImageFile',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('source_file', models.ImageField(width_field='full_width', upload_to='INCOMING', height_field='full_height')),
                ('old_file_path', models.CharField(null=True, help_text='previous path if the image has been moved.', max_length=100, blank=True)),
            ],
            options={
                'verbose_name_plural': 'ImageFiles',
                'verbose_name': 'ImageFile',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='image',
            name='image_file',
            field=models.ForeignKey(to='photo.ImageFile'),
            preserve_default=True,
        ),
    ]
