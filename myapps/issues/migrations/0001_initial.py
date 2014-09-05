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
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('issue_name', models.CharField(max_length=50)),
                ('publication_date', models.DateField()),
                ('pages', models.IntegerField(help_text='Number of pages')),
                ('pdf', models.FilePathField(null=True, help_text='Pdf file for this issue.', blank=True)),
                ('cover_page', models.FilePathField(null=True, help_text='An image file of the front page', blank=True)),
            ],
            options={
                'verbose_name': 'Print issue',
                'verbose_name_plural': 'Print issues',
            },
            bases=(models.Model,),
        ),
    ]
