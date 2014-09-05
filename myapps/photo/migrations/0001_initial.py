# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import sorl.thumbnail.fields
import django.core.validators
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='ImageFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('created', model_utils.fields.AutoCreatedField(editable=False, verbose_name='created', default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, verbose_name='modified', default=django.utils.timezone.now)),
                ('source_file', sorl.thumbnail.fields.ImageField(height_field='full_height', width_field='full_width', upload_to='', max_length=1024)),
                ('full_height', models.PositiveIntegerField(help_text='full height in pixels', editable=False, verbose_name='full height')),
                ('full_width', models.PositiveIntegerField(help_text='full height in pixels', editable=False, verbose_name='full height')),
                ('vertical_centre', models.PositiveSmallIntegerField(help_text='image crop vertical. Between 0% and 100%.', validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], default=50)),
                ('horizontal_centre', models.PositiveSmallIntegerField(help_text='image crop horizontal. Between 0% and 100%.', validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], default=50)),
                ('autocrop', models.BooleanField(help_text='this image has been automatically cropped', verbose_name='automatic cropping', default=True)),
                ('old_file_path', models.CharField(help_text='previous path if the image has been moved.', blank=True, null=True, max_length=1000)),
                ('copyright_information', models.CharField(help_text='extra information about license and attribution if needed.', blank=True, null=True, max_length=1000)),
                ('contributor', models.ForeignKey(help_text='who made this', null=True, to='contributors.Contributor', blank=True)),
            ],
            options={
                'verbose_name_plural': 'ImageFiles',
                'verbose_name': 'ImageFile',
            },
            bases=(models.Model,),
        ),
    ]
