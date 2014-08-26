# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('frontpage', '0002_auto_20140826_1436'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='frontpage',
            name='draft_of',
        ),
    ]
