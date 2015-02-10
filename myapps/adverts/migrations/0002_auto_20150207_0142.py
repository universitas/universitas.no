# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import sorl.thumbnail.fields


class Migration(migrations.Migration):

    dependencies = [
        ('adverts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdFormat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(unique=True, max_length=50)),
                ('width', models.PositiveSmallIntegerField()),
                ('height', models.PositiveSmallIntegerField()),
                ('price', models.PositiveIntegerField(help_text='display price')),
                ('published', models.BooleanField(default=True)),
                ('category', models.PositiveSmallIntegerField(choices=[(1, 'print'), (2, 'web')], default=2)),
            ],
            options={
                'verbose_name': 'AdFormat',
                'verbose_name_plural': 'AdFormats',
            },
            bases=(models.Model,),
        ),
        migrations.AlterUniqueTogether(
            name='adformat',
            unique_together=set([('width', 'height')]),
        ),
        migrations.RemoveField(
            model_name='location',
            name='height',
        ),
        migrations.RemoveField(
            model_name='location',
            name='width',
        ),
        migrations.AddField(
            model_name='advert',
            name='alt_text',
            field=models.CharField(default='', blank=True, max_length=50),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='advert',
            name='html_source',
            field=models.TextField(blank=True, null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='advert',
            name='imagefile',
            field=sorl.thumbnail.fields.ImageField(blank=True, null=True, upload_to='adverts'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='advert',
            name='link',
            field=models.URLField(blank=True, null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='advert',
            name='priority',
            field=models.PositiveIntegerField(default=1),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='location',
            name='ad_format',
            field=models.ForeignKey(null=True, to='adverts.AdFormat', help_text='size and shape of ad'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='location',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='location',
            name='extra_classes',
            field=models.CharField(help_text='comma separated list of extra css classes to apply.', blank=True, max_length=50),
        ),
    ]
