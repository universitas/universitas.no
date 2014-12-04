# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0007_auto_20141202_2023'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='story',
            name='images',
        ),
    ]
