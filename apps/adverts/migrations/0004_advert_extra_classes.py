# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adverts', '0003_universitas_ad_channels'),
    ]

    operations = [
        migrations.AddField(
            model_name='advert',
            name='extra_classes',
            field=models.CharField(max_length=200, blank=True, default=''),
            preserve_default=False,
        ),
    ]
