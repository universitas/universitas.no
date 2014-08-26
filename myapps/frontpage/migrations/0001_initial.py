# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import model_utils.fields
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Frontpage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('label', models.CharField(max_length=100, unique=True, help_text='Unique label used in url')),
                ('published', models.BooleanField(default=False, help_text='This page is published.')),
                ('draft_of', models.ForeignKey(to='frontpage.Frontpage', blank=True, null=True, editable=False, help_text='Is a draft version of other Frontpage.')),
            ],
            options={
                'verbose_name': 'Frontpage',
                'verbose_name_plural': 'Frontpages',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='FrontpageStory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('headline', models.CharField(max_length=200, blank=True, help_text='headline')),
                ('kicker', models.CharField(max_length=200, blank=True, help_text='kicker')),
                ('lede', models.CharField(max_length=200, blank=True, help_text='lede')),
                ('html_class', models.CharField(max_length=200, blank=True, help_text='html_class')),
                ('story', models.ForeignKey(to='stories.Story')),
            ],
            options={
                'verbose_name': 'Frontpage Story',
                'verbose_name_plural': 'Frontpage Stories',
            },
            bases=(models.Model,),
        ),
    ]
