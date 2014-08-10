# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import model_utils.fields
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0001_initial'),
        ('stories', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Frontpage',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(editable=False, verbose_name='created', default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, verbose_name='modified', default=django.utils.timezone.now)),
                ('label', models.CharField(help_text='Unique label used in url', max_length=100, unique=True)),
                ('published', models.BooleanField(help_text='This page is published.', default=False)),
                ('draft_of', models.ForeignKey(editable=False, null=True, help_text='Is a draft version of other Frontpage.', to='frontpage.Frontpage', blank=True)),
            ],
            options={
                'verbose_name_plural': 'Frontpages',
                'verbose_name': 'Frontpage',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='FrontpageStory',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(editable=False, verbose_name='created', default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, verbose_name='modified', default=django.utils.timezone.now)),
                ('headline', models.CharField(help_text='headline', max_length=200, blank=True)),
                ('kicker', models.CharField(help_text='kicker', max_length=200, blank=True)),
                ('lede', models.CharField(help_text='lede', max_length=200, blank=True)),
                ('html_class', models.CharField(help_text='html_class', max_length=200, blank=True)),
                ('image', models.ForeignKey(to='photo.Image')),
                ('story', models.ForeignKey(to='stories.Story')),
            ],
            options={
                'verbose_name_plural': 'FrontpageStorys',
                'verbose_name': 'FrontpageStory',
            },
            bases=(models.Model,),
        ),
    ]
