# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import sorl.thumbnail.fields


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0002_auto_20141120_2340'),
    ]

    operations = [
        migrations.AlterField(
            model_name='printissue',
            name='cover_page',
            field=sorl.thumbnail.fields.ImageField(blank=True, upload_to='pdf/covers', help_text='An image file of the front page', null=True),
        ),
    ]
