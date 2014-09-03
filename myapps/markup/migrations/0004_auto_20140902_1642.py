# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('markup', '0003_auto_20140902_1600'),
    ]

    operations = [
        migrations.CreateModel(
            name='BlockTag',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('start_tag', models.CharField(max_length=50, default='', unique=True)),
                ('html_tag', models.CharField(max_length=50, default='')),
                ('html_class', models.CharField(max_length=50, default='', blank=True)),
                ('action', models.CharField(max_length=200, default='add_to:', choices=[('add_to:', 'add'), ('add_to:bodytext', 'body text'), ('add_to:title', 'title'), ('add_to:kicker', 'kicker'), ('add_to:lede', 'lede'), ('add_to:theme_word', 'theme word'), ('new:byline', 'byline'), ('new:aside', 'aside'), ('new:pullquote', 'pullquote'), ('drop:', 'delete')])),
            ],
            options={
                'verbose_name': 'block tag',
                'verbose_name_plural': 'block tags',
            },
            bases=(models.Model,),
        ),
        migrations.DeleteModel(
            name='ProdsysTag',
        ),
    ]
