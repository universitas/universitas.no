# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0006_auto_20150310_0117'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='issue',
            options={'ordering': ['-publication_date']},
        ),
    ]
