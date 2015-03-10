# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0002_auto_20150307_0013'),
    ]

    operations = [
        migrations.CreateModel(
            name='Issue',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('publication_date', models.DateField(null=True, blank=True)),
                ('issue_type', models.PositiveSmallIntegerField(choices=[(1, 'Regular'), (2, 'Magazine'), (3, 'Welcome special')], default=1)),
            ],
            options={
                'ordering': ['publication_date'],
            },
            bases=(models.Model,),
        ),
        migrations.AlterModelOptions(
            name='printissue',
            options={'verbose_name_plural': 'Pdf issues', 'verbose_name': 'Pdf issue'},
        ),
        migrations.RemoveField(
            model_name='printissue',
            name='issue_name',
        ),
    ]
