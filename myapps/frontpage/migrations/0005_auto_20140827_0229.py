# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import myapps.frontpage.models


class Migration(migrations.Migration):

    dependencies = [
        ('frontpage', '0004_auto_20140826_1833'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='contentblock',
            options={'ordering': ['-position'], 'verbose_name_plural': 'Content blocks', 'verbose_name': 'Content block'},
        ),
        migrations.AddField(
            model_name='contentblock',
            name='height',
            field=models.PositiveSmallIntegerField(help_text='height - minimum 1 maximum 3', validators=[myapps.frontpage.models.Contentblock.validate_height], default=1),
            preserve_default=True,
        ),
    ]
