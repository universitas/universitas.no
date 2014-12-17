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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('name', models.CharField(null=True, blank=True, max_length=200)),
                ('title', models.CharField(null=True, blank=True, max_length=200)),
                ('phone', models.CharField(null=True, blank=True, max_length=20)),
                ('email', models.EmailField(null=True, blank=True, max_length=75)),
                ('postal_address', models.CharField(null=True, blank=True, max_length=200)),
                ('street_address', models.CharField(null=True, blank=True, max_length=200)),
                ('webpage', models.URLField()),
                ('contact_type', models.CharField(choices=[('Person', 'Person'), ('Institution', 'Institution'), ('Position', 'Position')], max_length=50)),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('display_name', models.CharField(blank=True, max_length=50)),
                ('aliases', models.TextField(blank=True)),
                ('initials', models.CharField(null=True, blank=True, max_length=5)),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('title', models.CharField(max_length=50, unique=True, help_text='Job title at the publication.')),
            ],
            options={
                'verbose_name': 'Position',
                'verbose_name_plural': 'Positions',
            },
            bases=(models.Model,),
        ),
    ]
