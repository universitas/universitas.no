# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0004_auto_20140824_1347'),
    ]

    operations = [
        migrations.AddField(
            model_name='imagefile',
            name='autocrop',
            field=models.BooleanField(help_text='this image has been automatically cropped', verbose_name='automatic cropping', default=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='imagefile',
            name='horizontal_centre',
            field=models.PositiveSmallIntegerField(help_text='image crop horizontal. Between 0% and 100%.', validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], default=50),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='imagefile',
            name='vertical_centre',
            field=models.PositiveSmallIntegerField(help_text='image crop vertical. Between 0% and 100%.', validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], default=50),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='imagefile',
            name='contributor',
            field=models.ForeignKey(to='contributors.Contributor', blank=True, help_text='who made this', null=True),
        ),
        migrations.AlterField(
            model_name='imagefile',
            name='copyright_information',
            field=models.CharField(max_length=1000, help_text='extra information about license and attribution if needed.', blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='imagefile',
            name='full_height',
            field=models.PositiveIntegerField(editable=False, help_text='full height in pixels', verbose_name='full height'),
        ),
        migrations.AlterField(
            model_name='imagefile',
            name='full_width',
            field=models.PositiveIntegerField(editable=False, help_text='full height in pixels', verbose_name='full height'),
        ),
    ]
