# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adverts', '0005_advert_ad_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='advert',
            name='channel',
        ),
        migrations.AddField(
            model_name='advert',
            name='ad_channels',
            field=models.ManyToManyField(to='adverts.AdChannel', blank=True, null=True, help_text='Where to show the ad'),
            preserve_default=True,
        ),
    ]
