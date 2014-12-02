# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0005_auto_20141127_1424'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='aside',
            name='position',
        ),
        migrations.RemoveField(
            model_name='pullquote',
            name='position',
        ),
        migrations.RemoveField(
            model_name='storyimage',
            name='position',
        ),
        migrations.RemoveField(
            model_name='storyvideo',
            name='position',
        ),
        migrations.AddField(
            model_name='aside',
            name='position_horizontal',
            field=models.PositiveSmallIntegerField(verbose_name='horizontal position', help_text='Secondary ordering.', default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='aside',
            name='position_vertical',
            field=models.PositiveSmallIntegerField(verbose_name='position', help_text='Where in the story does this belong? 0 = At the very beginning, 1000 = At the end.', default=0, validators=[django.core.validators.MaxValueValidator(1000), django.core.validators.MinValueValidator(0)]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='pullquote',
            name='position_horizontal',
            field=models.PositiveSmallIntegerField(verbose_name='horizontal position', help_text='Secondary ordering.', default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='pullquote',
            name='position_vertical',
            field=models.PositiveSmallIntegerField(verbose_name='position', help_text='Where in the story does this belong? 0 = At the very beginning, 1000 = At the end.', default=0, validators=[django.core.validators.MaxValueValidator(1000), django.core.validators.MinValueValidator(0)]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='storyimage',
            name='position_horizontal',
            field=models.PositiveSmallIntegerField(verbose_name='horizontal position', help_text='Secondary ordering.', default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='storyimage',
            name='position_vertical',
            field=models.PositiveSmallIntegerField(verbose_name='position', help_text='Where in the story does this belong? 0 = At the very beginning, 1000 = At the end.', default=0, validators=[django.core.validators.MaxValueValidator(1000), django.core.validators.MinValueValidator(0)]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='storyvideo',
            name='position_horizontal',
            field=models.PositiveSmallIntegerField(verbose_name='horizontal position', help_text='Secondary ordering.', default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='storyvideo',
            name='position_vertical',
            field=models.PositiveSmallIntegerField(verbose_name='position', help_text='Where in the story does this belong? 0 = At the very beginning, 1000 = At the end.', default=0, validators=[django.core.validators.MaxValueValidator(1000), django.core.validators.MinValueValidator(0)]),
            preserve_default=True,
        ),
    ]
