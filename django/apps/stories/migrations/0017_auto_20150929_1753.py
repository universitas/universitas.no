# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0016_auto_20150924_2032'),
    ]

    operations = [
        migrations.AlterField(
            model_name='story',
            name='hot_count',
            field=models.PositiveIntegerField(verbose_name='recent page views', default=1000, help_text='calculated value representing recent page views.', editable=False),
        ),
    ]
