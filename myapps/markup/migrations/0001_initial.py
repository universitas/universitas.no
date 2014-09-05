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
                ('id', models.AutoField(serialize=False, verbose_name='ID', primary_key=True, auto_created=True)),
                ('pattern', models.CharField(max_length=100)),
                ('replacement', models.CharField(blank=True, max_length=100)),
                ('flags', models.CharField(blank=True, default='ILM', max_length=5)),
                ('flags_sum', models.PositiveSmallIntegerField(editable=False)),
                ('timing', models.PositiveSmallIntegerField(default=1, choices=[(1, 'first'), (2, 'later'), (3, 'last')])),
                ('ordering', models.PositiveSmallIntegerField(default=1)),
                ('comment', models.TextField(default='explain this pattern')),
            ],
            options={
                'ordering': ('ordering',),
                'verbose_name_plural': 'Aliases',
                'verbose_name': 'Alias',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='BlockTag',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', primary_key=True, auto_created=True)),
                ('start_tag', models.CharField(unique=True, blank=True, default='', max_length=50)),
                ('html_tag', models.CharField(default='p', max_length=50)),
                ('html_class', models.CharField(blank=True, default='', max_length=50)),
                ('action', models.CharField(default='append:', choices=[('append:', 'add'), ('append:bodytext', 'body text'), ('append:title', 'title'), ('append:kicker', 'kicker'), ('append:lede', 'lede'), ('append:theme_word', 'theme word'), ('new:byline', 'byline'), ('new:aside', 'create aside'), ('new:pullquote', 'create pullquote'), ('drop:', 'delete')], max_length=200)),
            ],
            options={
                'verbose_name_plural': 'block tags',
                'verbose_name': 'block tag',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='InlineTag',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', primary_key=True, auto_created=True)),
                ('start_tag', models.CharField(unique=True, blank=True, default='', max_length=50)),
                ('html_tag', models.CharField(default='p', max_length=50)),
                ('html_class', models.CharField(blank=True, default='', max_length=50)),
                ('end_tag', models.CharField(max_length=50)),
                ('pattern', models.CharField(blank=True, default='', max_length=200)),
                ('replacement', models.CharField(blank=True, default='', max_length=200)),
            ],
            options={
                'verbose_name_plural': 'inline tags',
                'verbose_name': 'inline tag',
            },
            bases=(models.Model,),
        ),
    ]
