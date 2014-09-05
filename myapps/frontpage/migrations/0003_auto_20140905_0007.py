# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('frontpage', '0002_auto_20140904_2322'),
    ]

    operations = [
        migrations.RenameField(
            model_name='frontpagestory',
            old_name='image',
            new_name='imagefile',
        ),
    ]
