# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '__latest__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
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
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('source_file', models.ImageField(upload_to='INCOMING', width_field='full_width', height_field='full_height')),
                ('old_file_path', models.CharField(help_text='previous path if the image has been moved.', max_length=100, blank=True, null=True)),
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
