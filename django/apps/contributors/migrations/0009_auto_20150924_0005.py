# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '0008_auto_20150513_0006'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contributor',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
    ]
