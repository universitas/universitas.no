# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0010_auto_20141204_1344'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='storyelement',
            name='inline',
        ),
        migrations.AddField(
            model_name='storyelement',
            name='top',
            field=models.BooleanField(default=False, help_text='Is this element placed on top?'),
            preserve_default=True,
        ),
    ]
