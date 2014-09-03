# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('markup', '0004_auto_20140902_1642'),
    ]

    operations = [
        migrations.CreateModel(
            name='Alias',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('pattern', models.CharField(max_length=100)),
                ('replacement', models.CharField(max_length=100, blank=True)),
                ('flags', models.CharField(max_length=5, blank=True, default='ILM')),
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
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('start_tag', models.CharField(unique=True, max_length=50, default='')),
                ('html_tag', models.CharField(max_length=50, default='p')),
                ('html_class', models.CharField(max_length=50, blank=True, default='')),
                ('end_tag', models.CharField(max_length=50)),
            ],
            options={
                'verbose_name': 'inline tag',
                'verbose_name_plural': 'inline tags',
            },
            bases=(models.Model,),
        ),
        migrations.AlterField(
            model_name='blocktag',
            name='action',
            field=models.CharField(max_length=200, default='add_to:', choices=[('add_to:', 'add'), ('add_to:bodytext', 'body text'), ('add_to:title', 'title'), ('add_to:kicker', 'kicker'), ('add_to:lede', 'lede'), ('add_to:theme_word', 'theme word'), ('new:byline', 'byline'), ('new:aside', 'create aside'), ('new:pullquote', 'create pullquote'), ('drop:', 'delete')]),
        ),
        migrations.AlterField(
            model_name='blocktag',
            name='html_tag',
            field=models.CharField(max_length=50, default='p'),
        ),
    ]
