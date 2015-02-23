# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('frontpage', '0002_ensure_one_frontpage'),
    ]

    operations = [
        migrations.AddField(
            model_name='frontpagestory',
            name='vignette',
            field=models.CharField(max_length=50, blank=True, help_text='vignette', default=''),
            preserve_default=False,
        ),
    ]
