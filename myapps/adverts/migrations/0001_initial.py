# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Advert',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', primary_key=True, auto_created=True)),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
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
                ('id', models.AutoField(serialize=False, verbose_name='ID', primary_key=True, auto_created=True)),
                ('name', models.CharField(max_length=500)),
                ('contact_info', models.TextField(blank=True)),
            ],
            options={
                'verbose_name': 'Customer',
                'verbose_name_plural': 'Customers',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', primary_key=True, auto_created=True)),
                ('label', models.CharField(max_length=50, unique=True)),
                ('description', models.TextField()),
                ('height', models.PositiveSmallIntegerField()),
                ('width', models.PositiveSmallIntegerField()),
                ('extra_classes', models.CharField(max_length=50, blank=True)),
            ],
            options={
                'verbose_name': 'Location',
                'verbose_name_plural': 'Locations',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='advert',
            name='customer',
            field=models.ForeignKey(to='adverts.Customer'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='advert',
            name='location',
            field=models.ForeignKey(to='adverts.Location'),
            preserve_default=True,
        ),
    ]
