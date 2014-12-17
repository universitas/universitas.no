# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import model_utils.fields
import myapps.frontpage.models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0001_initial'),
        ('photo', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contentblock',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('position', models.PositiveIntegerField(help_text='larger numbers come first')),
                ('height', models.PositiveSmallIntegerField(default=1, validators=[myapps.frontpage.models.Contentblock.validate_height], help_text='height - minimum 1 maximum 3')),
                ('columns', models.PositiveSmallIntegerField(default=6, validators=[myapps.frontpage.models.Contentblock.validate_columns], help_text='width - minimum 1 maximum 12')),
            ],
            options={
                'ordering': ['-position'],
                'verbose_name': 'Content block',
                'verbose_name_plural': 'Content blocks',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Frontpage',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('label', models.CharField(max_length=100, unique=True, blank=True, help_text='Unique label used in url')),
                ('published', models.BooleanField(default=False, help_text='This page is published.')),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('headline', models.CharField(max_length=200, blank=True, help_text='headline')),
                ('kicker', models.CharField(max_length=200, blank=True, help_text='kicker')),
                ('lede', models.CharField(max_length=200, blank=True, help_text='lede')),
                ('html_class', models.CharField(max_length=200, blank=True, help_text='html_class')),
                ('imagefile', models.ForeignKey(to='photo.ImageFile', blank=True, help_text='image', null=True)),
                ('placements', models.ManyToManyField(through='frontpage.Contentblock', to='frontpage.Frontpage', help_text='position and size of story element.')),
                ('story', models.ForeignKey(to='stories.Story')),
            ],
            options={
                'verbose_name': 'Frontpage Story',
                'verbose_name_plural': 'Frontpage Stories',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='contentblock',
            name='frontpage',
            field=models.ForeignKey(to='frontpage.Frontpage', editable=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='contentblock',
            name='frontpage_story',
            field=models.ForeignKey(to='frontpage.FrontpageStory', editable=False),
            preserve_default=True,
        ),
    ]
