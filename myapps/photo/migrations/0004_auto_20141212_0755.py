# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0003_auto_20141212_0518'),
    ]

    operations = [
        migrations.RenameField(
            model_name='imagefile',
            old_name='horizontal_centre',
            new_name='from_left',
        ),
        migrations.RenameField(
            model_name='imagefile',
            old_name='vertical_centre',
            new_name='from_top',
        ),
    ]
