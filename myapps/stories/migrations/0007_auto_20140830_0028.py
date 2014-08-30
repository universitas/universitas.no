# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0006_story_views'),
    ]

    operations = [
        migrations.AddField(
            model_name='story',
            name='bylines_html',
            field=models.TextField(verbose_name='all bylines as html.', default=''),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='story',
            name='views',
            field=models.PositiveIntegerField(help_text='how many time the article has been viewed', verbose_name='views', default=0, editable=False),
        ),
    ]
