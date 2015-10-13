# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0002_auto_20150512_1301'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProfileImage',
            fields=[
            ],
            options={
                'proxy': True,
            },
            bases=('photo.imagefile',),
        ),
    ]
