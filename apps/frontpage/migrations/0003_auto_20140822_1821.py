# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('frontpage', '0002_remove_frontpagestory_image'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='frontpagestory',
            options={'verbose_name': 'Frontpage Story', 'verbose_name_plural': 'Frontpage Stories'},
        ),
    ]
