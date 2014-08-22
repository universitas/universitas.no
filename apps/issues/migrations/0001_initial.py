# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PrintIssue',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('issue_name', models.CharField(max_length=50)),
                ('publication_date', models.DateField()),
                ('pages', models.IntegerField(help_text='Number of pages')),
                ('pdf', models.FilePathField(null=True, blank=True, help_text='Pdf file for this issue.')),
                ('cover_page', models.FilePathField(null=True, blank=True, help_text='An image file of the front page')),
            ],
            options={
                'verbose_name': 'Issue',
                'verbose_name_plural': 'Issues',
            },
            bases=(models.Model,),
        ),
    ]
