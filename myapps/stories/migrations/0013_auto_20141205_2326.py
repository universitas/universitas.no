# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0012_auto_20141205_2312'),
    ]

    operations = [
        migrations.AlterField(
            model_name='story',
            name='comment',
            field=models.TextField(blank=True, help_text='for internal use only', default='', verbose_name='comment'),
        ),
    ]
