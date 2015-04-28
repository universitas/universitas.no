# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators
import model_utils.fields
import sorl.thumbnail.fields
import django.utils.timezone


class Migration(migrations.Migration):

    replaces = [('photo', '0001_initial'), ('photo', '0002_imagefile_crop_diameter'), ('photo', '0003_auto_20150228_2151')]

    dependencies = [
        ('contributors', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ImageFile',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, verbose_name='ID', auto_created=True)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('source_file', sorl.thumbnail.fields.ImageField(max_length=1024, upload_to='', height_field='full_height', width_field='full_width')),
                ('full_height', models.PositiveIntegerField(verbose_name='full height', editable=False, help_text='full height in pixels')),
                ('full_width', models.PositiveIntegerField(verbose_name='full height', editable=False, help_text='full height in pixels')),
                ('from_top', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], default=50, help_text='image crop vertical. Between 0% and 100%.')),
                ('from_left', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], default=50, help_text='image crop horizontal. Between 0% and 100%.')),
                ('cropping_method', models.PositiveSmallIntegerField(default=0, help_text='How this image has been cropped.', choices=[(0, 'center'), (5, 'corner detection'), (10, 'multiple faces'), (15, 'single face'), (100, 'manual crop')])),
                ('old_file_path', models.CharField(help_text='previous path if the image has been moved.', max_length=1000, blank=True, null=True)),
                ('copyright_information', models.CharField(help_text='extra information about license and attribution if needed.', max_length=1000, blank=True, null=True)),
                ('contributor', models.ForeignKey(to='contributors.Contributor', blank=True, help_text='who made this', null=True)),
                ('crop_diameter', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], default=100, help_text='area containing most relevant content. Area is considered a circle with center x,y and diameter d where x and y are the values "from_left" and "from_right" and d is a percentage of the shortest axis. This is used for close cropping of some images, for instance byline photos.')),
            ],
            options={
                'verbose_name': 'ImageFile',
                'verbose_name_plural': 'ImageFiles',
            },
            bases=(models.Model,),
        ),
    ]
