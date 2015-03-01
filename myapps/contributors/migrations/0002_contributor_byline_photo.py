# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0003_auto_20150228_2151'),
        ('contributors', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='contributor',
            name='byline_photo',
            field=models.ForeignKey(help_text='photo used for byline credit.', null=True, related_name='person', blank=True, to='photo.ImageFile'),
            preserve_default=True,
        ),
    ]
