# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0005_auto_20140828_1605'),
    ]

    operations = [
        migrations.AddField(
            model_name='story',
            name='views',
            field=models.PositiveIntegerField(verbose_name='views', help_text='how many time the article has been viewed', default=0),
            preserve_default=True,
        ),
    ]
