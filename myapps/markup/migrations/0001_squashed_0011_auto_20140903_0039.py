# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    replaces = [('markup', '0001_initial'), ('markup', '0002_auto_20140902_1519'), ('markup', '0003_auto_20140902_1600'), ('markup', '0004_auto_20140902_1642'), ('markup', '0005_auto_20140902_2140'), ('markup', '0006_auto_20140902_2144'), ('markup', '0007_auto_20140902_2301'), ('markup', '0008_inlinetag_pattern'), ('markup', '0009_inlinetag_replacement'), ('markup', '0010_auto_20140902_2342'), ('markup', '0011_auto_20140903_0039')]

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BlockTag',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('start_tag', models.CharField(default='', unique=True, blank=True, max_length=50)),
                ('html_tag', models.CharField(default='p', max_length=50)),
                ('html_class', models.CharField(default='', blank=True, max_length=50)),
                ('action', models.CharField(default='append:', choices=[('append:', 'add'), ('append:bodytext', 'body text'), ('append:title', 'title'), ('append:kicker', 'kicker'), ('append:lede', 'lede'), ('append:theme_word', 'theme word'), ('new:byline', 'byline'), ('new:aside', 'create aside'), ('new:pullquote', 'create pullquote'), ('drop:', 'delete')], max_length=200)),
            ],
            options={
                'verbose_name_plural': 'block tags',
                'verbose_name': 'block tag',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Alias',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('pattern', models.CharField(max_length=100)),
                ('replacement', models.CharField(blank=True, max_length=100)),
                ('flags', models.CharField(default='ILM', blank=True, max_length=5)),
                ('flags_sum', models.PositiveSmallIntegerField(editable=False)),
                ('timing', models.PositiveSmallIntegerField(default=1, choices=[(1, 'first'), (2, 'later'), (3, 'last')])),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='InlineTag',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('start_tag', models.CharField(default='', unique=True, blank=True, max_length=50)),
                ('html_tag', models.CharField(default='p', max_length=50)),
                ('html_class', models.CharField(default='', blank=True, max_length=50)),
                ('end_tag', models.CharField(max_length=50)),
                ('pattern', models.CharField(default='', blank=True, max_length=200)),
                ('replacement', models.CharField(default='', blank=True, max_length=200)),
            ],
            options={
                'verbose_name_plural': 'inline tags',
                'verbose_name': 'inline tag',
            },
            bases=(models.Model,),
        ),
        migrations.AlterModelOptions(
            name='alias',
            options={'verbose_name_plural': 'Aliases', 'verbose_name': 'Alias'},
        ),
        migrations.AddField(
            model_name='alias',
            name='ordering',
            field=models.PositiveSmallIntegerField(default=1),
            preserve_default=True,
        ),
        migrations.AlterModelOptions(
            name='alias',
            options={'ordering': ('ordering',), 'verbose_name_plural': 'Aliases', 'verbose_name': 'Alias'},
        ),
        migrations.AddField(
            model_name='alias',
            name='comment',
            field=models.TextField(default='explain this pattern'),
            preserve_default=True,
        ),
    ]
