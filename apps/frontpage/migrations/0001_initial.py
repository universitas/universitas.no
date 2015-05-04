# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import apps.frontpage.models
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0004_auto_20150205_1331'),
        ('photo', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Frontpage',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('created', model_utils.fields.AutoCreatedField(editable=False, verbose_name='created', default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, verbose_name='modified', default=django.utils.timezone.now)),
                ('label', models.CharField(max_length=100, blank=True, help_text='Unique label used in url', unique=True)),
                ('published', models.BooleanField(help_text='This page is published.', default=False)),
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
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('created', model_utils.fields.AutoCreatedField(editable=False, verbose_name='created', default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, verbose_name='modified', default=django.utils.timezone.now)),
                ('headline', models.CharField(max_length=200, blank=True, help_text='headline')),
                ('kicker', models.CharField(max_length=200, blank=True, help_text='kicker')),
                ('lede', models.CharField(max_length=200, blank=True, help_text='lede')),
                ('html_class', models.CharField(max_length=200, blank=True, help_text='html_class')),
                ('imagefile', models.ForeignKey(blank=True, help_text='image', null=True, to='photo.ImageFile')),
            ],
            options={
                'verbose_name_plural': 'Frontpage Stories',
                'verbose_name': 'Frontpage Story',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='StaticModule',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('created', model_utils.fields.AutoCreatedField(editable=False, verbose_name='created', default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, verbose_name='modified', default=django.utils.timezone.now)),
                ('height', models.PositiveSmallIntegerField(validators=[apps.frontpage.models.FrontPageModule.validate_height], help_text='height - minimum 1 maximum 3', default=1)),
                ('columns', models.PositiveSmallIntegerField(validators=[apps.frontpage.models.FrontPageModule.validate_columns], help_text='width - minimum 1 maximum 12', default=6)),
                ('name', models.CharField(max_length=50)),
                ('content', models.TextField()),
                ('position', models.IntegerField(help_text='Placement on front page')),
                ('render_template', models.BooleanField(help_text='Use django rendering', default=False)),
                ('frontpage', models.ForeignKey(to='frontpage.Frontpage')),
            ],
            options={
                'verbose_name_plural': 'Static modules',
                'verbose_name': 'Static module',
                'ordering': ['position'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='StoryModule',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('created', model_utils.fields.AutoCreatedField(editable=False, verbose_name='created', default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, verbose_name='modified', default=django.utils.timezone.now)),
                ('height', models.PositiveSmallIntegerField(validators=[apps.frontpage.models.FrontPageModule.validate_height], help_text='height - minimum 1 maximum 3', default=1)),
                ('columns', models.PositiveSmallIntegerField(validators=[apps.frontpage.models.FrontPageModule.validate_columns], help_text='width - minimum 1 maximum 12', default=6)),
                ('position', models.PositiveIntegerField(help_text='larger numbers come first')),
                ('frontpage', models.ForeignKey(to='frontpage.Frontpage')),
                ('frontpage_story', models.ForeignKey(editable=False, to='frontpage.FrontpageStory')),
            ],
            options={
                'verbose_name_plural': 'Story module',
                'verbose_name': 'Story module',
                'ordering': ['-position'],
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='frontpagestory',
            name='placements',
            field=models.ManyToManyField(through='frontpage.StoryModule', help_text='position and size of story element.', to='frontpage.Frontpage'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='frontpagestory',
            name='story',
            field=models.ForeignKey(to='stories.Story'),
            preserve_default=True,
        ),
    ]
