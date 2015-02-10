# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adverts', '0007_auto_20150210_1744'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='advert',
            name='ad_format',
        ),
    ]
