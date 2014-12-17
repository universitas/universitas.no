# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import myapps.frontpage.models
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0001_initial'),
        ('stories', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contentblock',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', editable=False, default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', editable=False, default=django.utils.timezone.now)),
                ('position', models.PositiveIntegerField(help_text='larger numbers come first')),
                ('height', models.PositiveSmallIntegerField(default=1, help_text='height - minimum 1 maximum 3', validators=[myapps.frontpage.models.Contentblock.validate_height])),
                ('columns', models.PositiveSmallIntegerField(default=6, help_text='width - minimum 1 maximum 12', validators=[myapps.frontpage.models.Contentblock.validate_columns])),
            ],
            options={
                'verbose_name': 'Content block',
                'ordering': ['-position'],
                'verbose_name_plural': 'Content blocks',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Frontpage',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', editable=False, default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', editable=False, default=django.utils.timezone.now)),
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
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', editable=False, default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', editable=False, default=django.utils.timezone.now)),
                ('headline', models.CharField(max_length=200, blank=True, help_text='headline')),
                ('kicker', models.CharField(max_length=200, blank=True, help_text='kicker')),
                ('lede', models.CharField(max_length=200, blank=True, help_text='lede')),
                ('html_class', models.CharField(max_length=200, blank=True, help_text='html_class')),
                ('imagefile', models.ForeignKey(null=True, help_text='image', blank=True, to='photo.ImageFile')),
                ('placements', models.ManyToManyField(through='frontpage.Contentblock', help_text='position and size of story element.', to='frontpage.Frontpage')),
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
