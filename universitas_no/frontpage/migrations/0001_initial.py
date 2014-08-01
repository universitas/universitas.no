# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '__latest__'),
        ('photo', '__latest__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Frontpage',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('label', models.CharField(unique=True, help_text='Unique label used in url', max_length=100)),
                ('published', models.BooleanField(default=False, help_text='This page is published.')),
                ('draft_of', models.ForeignKey(to='frontpage.Frontpage', null=True, help_text='Is a draft version of other Frontpage.', editable=False, blank=True)),
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
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('headline', models.CharField(blank=True, help_text='headline', max_length=200)),
                ('kicker', models.CharField(blank=True, help_text='kicker', max_length=200)),
                ('lede', models.CharField(blank=True, help_text='lede', max_length=200)),
                ('html_class', models.CharField(blank=True, help_text='html_class', max_length=200)),
                ('image', models.ForeignKey(to='photo.Image')),
                ('story', models.ForeignKey(to='stories.Story')),
            ],
            options={
                'verbose_name': 'FrontpageStory',
                'verbose_name_plural': 'FrontpageStorys',
            },
            bases=(models.Model,),
        ),
    ]
