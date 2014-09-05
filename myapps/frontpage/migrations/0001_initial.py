# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import myapps.frontpage.models
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0001_initial'),
        ('photo', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contentblock',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('position', models.PositiveIntegerField(help_text='larger numbers come first')),
                ('height', models.PositiveSmallIntegerField(default=1, help_text='height - minimum 1 maximum 3', validators=[myapps.frontpage.models.Contentblock.validate_height])),
                ('columns', models.PositiveSmallIntegerField(default=6, help_text='width - minimum 1 maximum 12', validators=[myapps.frontpage.models.Contentblock.validate_columns])),
            ],
            options={
                'verbose_name': 'Content block',
                'verbose_name_plural': 'Content blocks',
                'ordering': ['-position'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Frontpage',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('label', models.CharField(blank=True, help_text='Unique label used in url', max_length=100, unique=True)),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('headline', models.CharField(blank=True, max_length=200, help_text='headline')),
                ('kicker', models.CharField(blank=True, max_length=200, help_text='kicker')),
                ('lede', models.CharField(blank=True, max_length=200, help_text='lede')),
                ('html_class', models.CharField(blank=True, max_length=200, help_text='html_class')),
                ('imagefile', models.ForeignKey(null=True, blank=True, to='photo.ImageFile', help_text='image')),
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
            field=models.ForeignKey(editable=False, to='frontpage.Frontpage'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='contentblock',
            name='frontpage_story',
            field=models.ForeignKey(editable=False, to='frontpage.FrontpageStory'),
            preserve_default=True,
        ),
    ]
