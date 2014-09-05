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
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('name', models.CharField(blank=True, null=True, max_length=200)),
                ('title', models.CharField(blank=True, null=True, max_length=200)),
                ('phone', models.CharField(blank=True, null=True, max_length=20)),
                ('email', models.EmailField(blank=True, null=True, max_length=75)),
                ('postal_address', models.CharField(blank=True, null=True, max_length=200)),
                ('street_address', models.CharField(blank=True, null=True, max_length=200)),
                ('webpage', models.URLField()),
                ('contact_type', models.CharField(choices=[('Person', 'Person'), ('Institution', 'Institution'), ('Position', 'Position')], max_length=50)),
            ],
            options={
                'verbose_name_plural': 'ContactInfo',
                'verbose_name': 'ContactInfo',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Contributor',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('display_name', models.CharField(blank=True, max_length=50)),
                ('aliases', models.TextField(blank=True)),
                ('initials', models.CharField(blank=True, null=True, max_length=5)),
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
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('title', models.CharField(unique=True, help_text='Job title at the publication.', max_length=50)),
            ],
            options={
                'verbose_name_plural': 'Positions',
                'verbose_name': 'Position',
            },
            bases=(models.Model,),
        ),
    ]
