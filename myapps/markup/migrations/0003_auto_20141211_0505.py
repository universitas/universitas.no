# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('markup', '0002_auto_20140906_0716'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blocktag',
            name='action',
            field=models.CharField(max_length=200, choices=[('append:', 'add'), ('alias', 'alias'), ('append:bodytext', 'body text'), ('append:title', 'title'), ('append:kicker', 'kicker'), ('append:lede', 'lede'), ('append:theme_word', 'theme word'), ('new:byline', 'byline'), ('new:aside', 'create aside'), ('new:pullquote', 'create pullquote'), ('drop:', 'delete')], default='append:'),
        ),
        migrations.AlterField(
            model_name='blocktag',
            name='html_tag',
            field=models.CharField(blank=True, max_length=50, default=''),
        ),
        migrations.AlterField(
            model_name='inlinetag',
            name='html_tag',
            field=models.CharField(blank=True, max_length=50, default=''),
        ),
    ]
