# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0002_storyimage_size'),
    ]

    operations = [
        migrations.AlterField(
            model_name='storyimage',
            name='creditline',
            field=models.CharField(help_text='Extra information about image.', max_length=100, blank=True),
        ),
    ]
