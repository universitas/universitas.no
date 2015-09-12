# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import apps.adverts.models
import sorl.thumbnail.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AdChannel',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('name', models.CharField(max_length=50, unique=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('extra_classes', models.CharField(help_text='comma separated list of extra css classes to apply.', max_length=50, blank=True)),
                ('max_at_once', models.PositiveSmallIntegerField(default=1, help_text='Maximum ads to show at once.')),
            ],
            options={
                'verbose_name': 'Location',
                'verbose_name_plural': 'Locations',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AdFormat',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('name', models.CharField(max_length=50, unique=True)),
                ('width', models.PositiveSmallIntegerField()),
                ('height', models.PositiveSmallIntegerField()),
                ('price', models.PositiveIntegerField(help_text='display price')),
                ('published', models.BooleanField(default=True)),
                ('category', models.PositiveSmallIntegerField(default=2, choices=[(1, 'print'), (2, 'web')])),
            ],
            options={
                'verbose_name': 'AdFormat',
                'ordering': ('category', '-width', '-price'),
                'verbose_name_plural': 'AdFormats',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Advert',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('description', models.CharField(help_text='Short description of this ad.', null=True, blank=True, max_length=100)),
                ('ordering', models.PositiveIntegerField(default=1, help_text='Ordering of the ad within the channel')),
                ('status', models.PositiveIntegerField(default=1, help_text='Publication status', choices=[(1, 'Not ready to publish.'), (2, 'Private.'), (3, 'Served to visiting audience.'), (4, 'Fallback ad served if no published ad exists in this channel.')])),
                ('ad_type', models.PositiveIntegerField(default=3, help_text='Advert type.', editable=False, choices=[(1, 'Image advert'), (2, 'HTML advert'), (3, 'Dummy or unfinished advert')])),
                ('start_time', models.DateTimeField(default=apps.adverts.models.default_start_time, help_text='When to start serving this ad')),
                ('end_time', models.DateTimeField(default=apps.adverts.models.default_end_time, help_text='When to stop serving this ad')),
                ('imagefile', sorl.thumbnail.fields.ImageField(upload_to=apps.adverts.models.upload_folder, help_text='Image Ad: image file in jpg or png format', null=True, blank=True)),
                ('link', models.URLField(help_text='Image Ad: url that ad links to', null=True, blank=True)),
                ('alt_text', models.CharField(default='', help_text='Image ad: alternative text for image', max_length=50, blank=True)),
                ('html_source', models.TextField(help_text='HTML to use for ad instead of serving an image ad.', null=True, blank=True)),
                ('ad_channels', models.ManyToManyField(help_text='Where to show the ad', null=True, blank=True, to='adverts.AdChannel')),
            ],
            options={
                'verbose_name': 'Advert',
                'verbose_name_plural': 'Adverts',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('name', models.CharField(max_length=500)),
                ('contact_info', models.TextField(blank=True)),
            ],
            options={
                'verbose_name': 'Customer',
                'verbose_name_plural': 'Customers',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='advert',
            name='customer',
            field=models.ForeignKey(help_text='Who bought this ad?', to='adverts.Customer'),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='adformat',
            unique_together=set([('width', 'height')]),
        ),
        migrations.AddField(
            model_name='adchannel',
            name='ad_formats',
            field=models.ManyToManyField(help_text='size and shape of ad', null=True, to='adverts.AdFormat'),
            preserve_default=True,
        ),
    ]
