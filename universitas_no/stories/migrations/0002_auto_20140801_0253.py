# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='storychild',
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name='storychild',
            name='story',
        ),
        migrations.DeleteModel(
            name='StoryChild',
        ),
        migrations.AlterField(
            model_name='byline',
            name='credit',
            field=models.CharField(max_length=20, choices=[('t', 'Text'), ('pf', 'Photo'), ('i', 'Illustration'), ('g', 'Graphics')], default='t'),
        ),
        migrations.AlterField(
            model_name='storyelementmixin',
            name='position',
            field=models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.', default=0),
        ),
    ]
