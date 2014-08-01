# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ContactInfo',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('name', models.CharField(null=True, max_length=200, blank=True)),
                ('title', models.CharField(null=True, max_length=200, blank=True)),
                ('phone', models.CharField(null=True, max_length=20, blank=True)),
                ('email', models.EmailField(null=True, max_length=75, blank=True)),
                ('postal_address', models.CharField(null=True, max_length=200, blank=True)),
                ('street_address', models.CharField(null=True, max_length=200, blank=True)),
                ('webpage', models.URLField()),
                ('contact_type', models.CharField(max_length=50, choices=[('Person', 'Person'), ('Institution', 'Institution'), ('Position', 'Position')])),
            ],
            options={
                'verbose_name_plural': 'ContactInfos',
                'verbose_name': 'ContactInfo',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Contributor',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('displayName', models.CharField(max_length=50, blank=True)),
                ('aliases', models.TextField(blank=True)),
                ('initials', models.CharField(null=True, max_length=5, blank=True)),
            ],
            options={
                'verbose_name_plural': 'Contributors',
                'verbose_name': 'Contributor',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Position',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('title', models.CharField(help_text='Job title at the publication.', unique=True, max_length=50)),
            ],
            options={
                'verbose_name_plural': 'Positions',
                'verbose_name': 'Position',
            },
            bases=(models.Model,),
        ),
    ]
