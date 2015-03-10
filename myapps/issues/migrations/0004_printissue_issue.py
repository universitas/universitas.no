# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0003_auto_20150309_2314'),
    ]

    operations = [
        migrations.AddField(
            model_name='printissue',
            name='issue',
            field=models.ForeignKey(to='issues.Issue', null=True),
            preserve_default=True,
        ),
    ]
