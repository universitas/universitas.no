# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0008_remove_story_images'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='storyelement',
            options={'ordering': ['-published', 'position_vertical', 'position_horizontal'], 'verbose_name': 'story element', 'verbose_name_plural': 'story elements'},
        ),
        migrations.AddField(
            model_name='storyelement',
            name='_subclass',
            field=models.CharField(default='', max_length=200),
            preserve_default=False,
        ),
    ]
