# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0015_auto_20150527_0201'),
    ]

    operations = [
        migrations.AlterField(
            model_name='story',
            name='hot_count',
            field=models.PositiveIntegerField(default=50, editable=False, help_text='calculated value representing recent page views.', verbose_name='recent page views'),
        ),
    ]
