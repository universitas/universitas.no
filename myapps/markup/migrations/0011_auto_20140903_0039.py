# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('markup', '0010_auto_20140902_2342'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blocktag',
            name='action',
            field=models.CharField(choices=[('append:', 'add'), ('append:bodytext', 'body text'), ('append:title', 'title'), ('append:kicker', 'kicker'), ('append:lede', 'lede'), ('append:theme_word', 'theme word'), ('new:byline', 'byline'), ('new:aside', 'create aside'), ('new:pullquote', 'create pullquote'), ('drop:', 'delete')], default='append:', max_length=200),
        ),
    ]
