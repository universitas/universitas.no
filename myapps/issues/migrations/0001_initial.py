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
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('publication_date', models.DateField()),
                ('pages', models.IntegerField(help_text='Number of pages')),
                ('pdf', models.FilePathField(help_text='Pdf file for this issue.', blank=True, null=True)),
                ('cover_page', models.FilePathField(help_text='An image file of the front page', blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Print issue',
                'verbose_name_plural': 'Print issues',
            },
            bases=(models.Model,),
        ),
    ]
