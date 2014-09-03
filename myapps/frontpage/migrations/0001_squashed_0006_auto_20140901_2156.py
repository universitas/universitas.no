# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import model_utils.fields
import django.utils.timezone
import myapps.frontpage.models
import django.core.validators


class Migration(migrations.Migration):

    replaces = [('frontpage', '0001_initial'), ('frontpage', '0002_auto_20140826_1436'), ('frontpage', '0003_remove_frontpage_draft_of'), ('frontpage', '0004_auto_20140826_1833'), ('frontpage', '0005_auto_20140827_0229'), ('frontpage', '0006_auto_20140901_2156')]

    dependencies = [
        ('stories', '0001_squashed_0011_auto_20140903_0253'),
        ('photo', '0004_auto_20140824_1347'),
    ]

    operations = [
        migrations.CreateModel(
            name='Frontpage',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('created', model_utils.fields.AutoCreatedField(editable=False, verbose_name='created', default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, verbose_name='modified', default=django.utils.timezone.now)),
                ('label', models.CharField(unique=True, max_length=100, help_text='Unique label used in url')),
                ('published', models.BooleanField(help_text='This page is published.', default=False)),
                ('draft_of', models.ForeignKey(editable=False, to='frontpage.Frontpage', blank=True, null=True, help_text='Is a draft version of other Frontpage.')),
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
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('created', model_utils.fields.AutoCreatedField(editable=False, verbose_name='created', default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, verbose_name='modified', default=django.utils.timezone.now)),
                ('headline', models.CharField(blank=True, help_text='headline', max_length=200)),
                ('kicker', models.CharField(blank=True, help_text='kicker', max_length=200)),
                ('lede', models.CharField(blank=True, help_text='lede', max_length=200)),
                ('html_class', models.CharField(blank=True, help_text='html_class', max_length=200)),
                ('story', models.ForeignKey(to='stories.Story')),
                ('image', models.ForeignKey(to='photo.ImageFile', null=True, help_text='image')),
            ],
            options={
                'verbose_name': 'Frontpage Story',
                'verbose_name_plural': 'Frontpage Stories',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Contentblock',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('created', model_utils.fields.AutoCreatedField(editable=False, verbose_name='created', default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, verbose_name='modified', default=django.utils.timezone.now)),
                ('position', models.PositiveIntegerField(help_text='larger numbers come first')),
                ('columns', models.PositiveSmallIntegerField(help_text='width - minimum 1 maximum 12', default=6, validators=[myapps.frontpage.models.Contentblock.validate_columns])),
                ('frontpage', models.ForeignKey(to='frontpage.Frontpage')),
            ],
            options={
                'ordering': ['position'],
                'verbose_name': 'Content block',
                'verbose_name_plural': 'Content blocks',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='frontpagestory',
            name='placements',
            field=models.ManyToManyField(through='frontpage.Contentblock', help_text='position and size of story element.', to='frontpage.Frontpage'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='frontpage',
            name='label',
            field=models.CharField(blank=True, unique=True, max_length=100, help_text='Unique label used in url'),
        ),
        migrations.RemoveField(
            model_name='frontpage',
            name='draft_of',
        ),
        migrations.AddField(
            model_name='contentblock',
            name='frontpage_story',
            field=models.ForeignKey(editable=False, to='frontpage.FrontpageStory', default=0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='contentblock',
            name='frontpage',
            field=models.ForeignKey(editable=False, to='frontpage.Frontpage'),
        ),
        migrations.AlterField(
            model_name='frontpagestory',
            name='image',
            field=models.ForeignKey(to='photo.ImageFile', blank=True, null=True, help_text='image'),
        ),
        migrations.AlterModelOptions(
            name='contentblock',
            options={'ordering': ['-position'], 'verbose_name_plural': 'Content blocks', 'verbose_name': 'Content block'},
        ),
        migrations.AddField(
            model_name='contentblock',
            name='height',
            field=models.PositiveSmallIntegerField(help_text='height - minimum 1 maximum 3', default=1, validators=[myapps.frontpage.models.Contentblock.validate_height]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='frontpagestory',
            name='horizontal_centre',
            field=models.PositiveSmallIntegerField(help_text='image crop horizontal. Between 0 and 100.', default='50', validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='frontpagestory',
            name='vertical_centre',
            field=models.PositiveSmallIntegerField(help_text='image crop vertical. Between 0 and 100.', default='50', validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)]),
            preserve_default=True,
        ),
    ]
