# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('frontpage', '0001_squashed_0006_auto_20140901_2156'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='frontpagestory',
            name='horizontal_centre',
        ),
        migrations.RemoveField(
            model_name='frontpagestory',
            name='vertical_centre',
        ),
    ]
