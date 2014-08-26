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
            name='issue_name',
            field=models.CharField(max_length=50, default='01'),
            preserve_default=False,
        ),
    ]
