# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ProdsysTag',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, verbose_name='ID', auto_created=True)),
                ('xtag', models.CharField(max_length=50, default='@tagname:', unique=True)),
                ('html_tag', models.CharField(max_length=50, default='p')),
                ('html_class', models.CharField(blank=True, null=True, max_length=50)),
            ],
            options={
                'verbose_name_plural': 'prodsys tags',
                'verbose_name': 'prodsys tag',
            },
            bases=(models.Model,),
        ),
    ]
