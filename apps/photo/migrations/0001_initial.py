# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ImageFile',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('created', model_utils.fields.AutoCreatedField(editable=False, verbose_name='created', default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, verbose_name='modified', default=django.utils.timezone.now)),
                ('source_file', models.ImageField(height_field='full_height', upload_to='upload/', max_length=1024, width_field='full_width')),
                ('full_height', models.PositiveIntegerField(editable=False)),
                ('full_width', models.PositiveIntegerField(editable=False)),
                ('old_file_path', models.CharField(max_length=100, blank=True, help_text='previous path if the image has been moved.', null=True)),
            ],
            options={
                'verbose_name_plural': 'ImageFiles',
                'verbose_name': 'ImageFile',
            },
            bases=(models.Model,),
        ),
    ]
