# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '0002_contributor_byline_photo'),
    ]

    operations = [
        migrations.AddField(
            model_name='contributor',
            name='verified',
            field=models.BooleanField(default=False, help_text='Verified to be a correct name.'),
            preserve_default=True,
        ),
    ]
