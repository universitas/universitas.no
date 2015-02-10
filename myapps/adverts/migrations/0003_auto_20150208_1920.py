# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import myapps.adverts.models
import sorl.thumbnail.fields


class Migration(migrations.Migration):

    dependencies = [
        ('adverts', '0002_auto_20150207_0142'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdChannel',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=50, unique=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('extra_classes', models.CharField(blank=True, max_length=50, help_text='comma separated list of extra css classes to apply.')),
                ('ad_formats', models.ManyToManyField(null=True, to='adverts.AdFormat', help_text='size and shape of ad')),
            ],
            options={
                'verbose_name_plural': 'Locations',
                'verbose_name': 'Location',
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='location',
            name='ad_format',
        ),
        migrations.RemoveField(
            model_name='advert',
            name='location',
        ),
        migrations.DeleteModel(
            name='Location',
        ),
        migrations.RemoveField(
            model_name='advert',
            name='priority',
        ),
        migrations.AddField(
            model_name='advert',
            name='ad_format',
            field=models.ForeignKey(help_text='Size and shape of ad', null=True, to='adverts.AdFormat'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='advert',
            name='channel',
            field=models.ForeignKey(help_text='Where to show the ad', null=True, to='adverts.AdChannel'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='advert',
            name='description',
            field=models.CharField(null=True, blank=True, max_length=100, help_text='Short description of this ad.'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='advert',
            name='ordering',
            field=models.PositiveIntegerField(default=1, help_text='Ordering of the ad within the channel'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='advert',
            name='status',
            field=models.PositiveIntegerField(choices=[(1, 'For internal viewing only.'), (2, 'Served to visiting audience.'), (3, 'Fallback ad served if no published ad exists in this channel.')], default=2, help_text='Publication status'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='advert',
            name='alt_text',
            field=models.CharField(blank=True, max_length=50, default='', help_text='Image ad: alternative text for image'),
        ),
        migrations.AlterField(
            model_name='advert',
            name='customer',
            field=models.ForeignKey(to='adverts.Customer', help_text='Who bought this ad?'),
        ),
        migrations.AlterField(
            model_name='advert',
            name='end_time',
            field=models.DateTimeField(default=myapps.adverts.models.default_end_time, help_text='When to stop serving this ad'),
        ),
        migrations.AlterField(
            model_name='advert',
            name='html_source',
            field=models.TextField(null=True, blank=True, help_text='HTML to use for ad instead of serving an image ad.'),
        ),
        migrations.AlterField(
            model_name='advert',
            name='imagefile',
            field=sorl.thumbnail.fields.ImageField(null=True, blank=True, upload_to=myapps.adverts.models.upload_folder, help_text='Image Ad: image file in jpg or png format'),
        ),
        migrations.AlterField(
            model_name='advert',
            name='link',
            field=models.URLField(null=True, blank=True, help_text='Image Ad: url that ad links to'),
        ),
        migrations.AlterField(
            model_name='advert',
            name='start_time',
            field=models.DateTimeField(default=myapps.adverts.models.default_start_time, help_text='When to start serving this ad'),
        ),
    ]
