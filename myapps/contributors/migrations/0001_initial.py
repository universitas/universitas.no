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
                ('name', models.CharField(max_length=200, blank=True, null=True)),
                ('title', models.CharField(max_length=200, blank=True, null=True)),
                ('phone', models.CharField(max_length=20, blank=True, null=True)),
                ('email', models.EmailField(max_length=75, blank=True, null=True)),
                ('postal_address', models.CharField(max_length=200, blank=True, null=True)),
                ('street_address', models.CharField(max_length=200, blank=True, null=True)),
                ('webpage', models.URLField()),
                ('contact_type', models.CharField(max_length=50, choices=[('Person', 'Person'), ('Institution', 'Institution'), ('Position', 'Position')])),
            ],
            options={
                'verbose_name': 'ContactInfo',
                'verbose_name_plural': 'ContactInfo',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Contributor',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('display_name', models.CharField(max_length=50, blank=True)),
                ('aliases', models.TextField(blank=True)),
                ('initials', models.CharField(max_length=5, blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Contributor',
                'verbose_name_plural': 'Contributors',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Position',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=50, unique=True, help_text='Job title at the publication.')),
            ],
            options={
                'verbose_name': 'Position',
                'verbose_name_plural': 'Positions',
            },
            bases=(models.Model,),
        ),
    ]
