# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import apps.contributors.models


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '0006_auto_20150512_2307'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stint',
            name='start_date',
            field=models.DateField(default=apps.contributors.models.today),
        ),
    ]
