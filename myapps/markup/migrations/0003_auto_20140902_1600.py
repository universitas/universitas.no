# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('markup', '0002_auto_20140902_1519'),
    ]

    operations = [
        migrations.AddField(
            model_name='prodsystag',
            name='story_field',
            field=models.CharField(choices=[('bodytext_markup', 'body text'), ('title', 'title'), ('kicker', 'kicker'), ('lede', 'lede'), ('theme_word', 'theme word'), ('bylines', 'bylines')], max_length=50, default='bodytext_markup'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='prodsystag',
            name='html_class',
            field=models.CharField(max_length=50, blank=True, default=''),
        ),
    ]
