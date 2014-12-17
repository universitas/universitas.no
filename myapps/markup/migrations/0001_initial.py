# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Alias',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('pattern', models.CharField(max_length=100)),
                ('replacement', models.CharField(max_length=100, blank=True)),
                ('flags', models.CharField(max_length=5, default='ILM', blank=True)),
                ('flags_sum', models.PositiveSmallIntegerField(editable=False)),
                ('timing', models.PositiveSmallIntegerField(default=1, choices=[(1, 'import'), (2, 'extra'), (3, 'bylines'), (4, 'clean')])),
                ('ordering', models.PositiveSmallIntegerField(default=1)),
                ('comment', models.CharField(max_length=1000, default='explain this pattern', blank=True)),
            ],
            options={
                'verbose_name': 'Alias',
                'ordering': ('ordering',),
                'verbose_name_plural': 'Aliases',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='BlockTag',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('start_tag', models.CharField(max_length=50, unique=True, default='', blank=True)),
                ('html_tag', models.CharField(max_length=50, default='', blank=True)),
                ('html_class', models.CharField(max_length=50, default='', blank=True)),
                ('action', models.CharField(max_length=200, default='append:', choices=[('append:', 'add'), ('alias', 'alias'), ('append:bodytext', 'body text'), ('append:title', 'title'), ('append:kicker', 'kicker'), ('append:lede', 'lede'), ('append:theme_word', 'theme word'), ('new:byline', 'byline'), ('new:aside', 'create aside'), ('new:pullquote', 'create pullquote'), ('drop:', 'delete')])),
            ],
            options={
                'verbose_name': 'block tag',
                'verbose_name_plural': 'block tags',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='InlineTag',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('start_tag', models.CharField(max_length=50, unique=True, default='', blank=True)),
                ('html_tag', models.CharField(max_length=50, default='', blank=True)),
                ('html_class', models.CharField(max_length=50, default='', blank=True)),
                ('end_tag', models.CharField(max_length=50)),
                ('pattern', models.CharField(max_length=200, default='', blank=True)),
                ('replacement', models.CharField(max_length=200, default='', blank=True)),
            ],
            options={
                'verbose_name': 'inline tag',
                'verbose_name_plural': 'inline tags',
            },
            bases=(models.Model,),
        ),
    ]
