# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('frontpage', '0004_auto_20150308_0249'),
    ]

    operations = [
        migrations.AlterField(
            model_name='staticmodule',
            name='frontpage',
            field=models.ForeignKey(default=1, to='frontpage.Frontpage'),
        ),
        migrations.AlterField(
            model_name='storymodule',
            name='frontpage',
            field=models.ForeignKey(default=1, to='frontpage.Frontpage'),
        ),
    ]
