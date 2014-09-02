# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('frontpage', '0005_auto_20140827_0229'),
    ]

    operations = [
        migrations.AddField(
            model_name='frontpagestory',
            name='horizontal_centre',
            field=models.PositiveSmallIntegerField(help_text='image crop horizontal. Between 0 and 100.', validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], default='50'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='frontpagestory',
            name='vertical_centre',
            field=models.PositiveSmallIntegerField(help_text='image crop vertical. Between 0 and 100.', validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], default='50'),
            preserve_default=True,
        ),
    ]
