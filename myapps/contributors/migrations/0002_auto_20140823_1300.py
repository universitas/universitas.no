# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='contributor',
            old_name='displayName',
            new_name='display_name',
        ),
    ]
