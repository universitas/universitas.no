# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators
import model_utils.fields
import sorl.thumbnail.fields
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ImageFile',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('source_file', sorl.thumbnail.fields.ImageField(width_field='full_width', height_field='full_height', upload_to='', max_length=1024)),
                ('full_height', models.PositiveIntegerField(verbose_name='full height', editable=False, help_text='full height in pixels')),
                ('full_width', models.PositiveIntegerField(verbose_name='full height', editable=False, help_text='full height in pixels')),
                ('from_top', models.PositiveSmallIntegerField(default=50, validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], help_text='image crop vertical. Between 0% and 100%.')),
                ('from_left', models.PositiveSmallIntegerField(default=50, validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], help_text='image crop horizontal. Between 0% and 100%.')),
                ('cropping_method', models.PositiveSmallIntegerField(choices=[(0, 'center'), (5, 'feature detection'), (10, 'face detection'), (100, 'manual crop')], default=0, help_text='How this image has been cropped.')),
                ('old_file_path', models.CharField(max_length=1000, null=True, blank=True, help_text='previous path if the image has been moved.')),
                ('copyright_information', models.CharField(max_length=1000, null=True, blank=True, help_text='extra information about license and attribution if needed.')),
                ('contributor', models.ForeignKey(to='contributors.Contributor', blank=True, help_text='who made this', null=True)),
            ],
            options={
                'verbose_name': 'ImageFile',
                'verbose_name_plural': 'ImageFiles',
            },
            bases=(models.Model,),
        ),
    ]
