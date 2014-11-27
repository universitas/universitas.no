# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='printissue',
            name='text',
            field=models.TextField(editable=False, help_text='Extracted from file.', default=''),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='printissue',
            name='pages',
            field=models.IntegerField(editable=False, help_text='Number of pages'),
        ),
    ]
