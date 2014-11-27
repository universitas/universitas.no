# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0003_auto_20141120_2348'),
    ]

    operations = [
        migrations.AlterField(
            model_name='printissue',
            name='pdf',
            field=models.FileField(help_text='Pdf file for this issue.', blank=True, null=True, upload_to='pdf'),
        ),
    ]
