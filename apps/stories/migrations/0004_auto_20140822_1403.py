# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0003_auto_20140822_0155'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='story',
            name='dateline_date',
        ),
        migrations.RemoveField(
            model_name='story',
            name='dateline_place',
        ),
        migrations.RemoveField(
            model_name='story',
            name='pdf_url',
        ),
        migrations.AlterField(
            model_name='story',
            name='issue',
            field=models.ForeignKey(blank=True, null=True, to='issues.PrintIssue', help_text='Which issue this story was printed in.'),
        ),
        migrations.DeleteModel(
            name='PrintIssue',
        ),
    ]
