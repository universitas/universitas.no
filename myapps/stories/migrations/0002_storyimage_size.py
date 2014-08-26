# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='storyimage',
            name='size',
            field=models.PositiveSmallIntegerField(help_text='relative image size.', default=1),
            preserve_default=True,
        ),
    ]
