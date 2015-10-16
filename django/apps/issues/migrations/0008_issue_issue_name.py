# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0007_auto_20150421_1938'),
    ]

    operations = [
        migrations.AddField(
            model_name='issue',
            name='issue_name',
            field=models.CharField(max_length=100, blank=True, editable=False),
        ),
    ]
