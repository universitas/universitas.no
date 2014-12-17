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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('pattern', models.CharField(max_length=100)),
                ('replacement', models.CharField(blank=True, max_length=100)),
                ('flags', models.CharField(default='ILM', blank=True, max_length=5)),
                ('flags_sum', models.PositiveSmallIntegerField(editable=False)),
                ('timing', models.PositiveSmallIntegerField(choices=[(1, 'import'), (2, 'extra'), (3, 'bylines'), (4, 'clean')], default=1)),
                ('ordering', models.PositiveSmallIntegerField(default=1)),
                ('comment', models.CharField(default='explain this pattern', blank=True, max_length=1000)),
            ],
            options={
                'ordering': ('ordering',),
                'verbose_name': 'Alias',
                'verbose_name_plural': 'Aliases',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='BlockTag',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('start_tag', models.CharField(default='', unique=True, blank=True, max_length=50)),
                ('html_tag', models.CharField(default='', blank=True, max_length=50)),
                ('html_class', models.CharField(default='', blank=True, max_length=50)),
                ('action', models.CharField(choices=[('append:', 'add'), ('alias', 'alias'), ('append:bodytext', 'body text'), ('append:title', 'title'), ('append:kicker', 'kicker'), ('append:lede', 'lede'), ('append:theme_word', 'theme word'), ('new:byline', 'byline'), ('new:aside', 'create aside'), ('new:pullquote', 'create pullquote'), ('drop:', 'delete')], default='append:', max_length=200)),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('start_tag', models.CharField(default='', unique=True, blank=True, max_length=50)),
                ('html_tag', models.CharField(default='', blank=True, max_length=50)),
                ('html_class', models.CharField(default='', blank=True, max_length=50)),
                ('end_tag', models.CharField(max_length=50)),
                ('pattern', models.CharField(default='', blank=True, max_length=200)),
                ('replacement', models.CharField(default='', blank=True, max_length=200)),
            ],
            options={
                'verbose_name': 'inline tag',
                'verbose_name_plural': 'inline tags',
            },
            bases=(models.Model,),
        ),
    ]
