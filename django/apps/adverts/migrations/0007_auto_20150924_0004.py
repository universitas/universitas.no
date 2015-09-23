# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adverts', '0006_auto_20150303_0009'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adchannel',
            name='ad_formats',
            field=models.ManyToManyField(to='adverts.AdFormat', help_text='size and shape of ad'),
        ),
        migrations.AlterField(
            model_name='advert',
            name='ad_channels',
            field=models.ManyToManyField(blank=True, to='adverts.AdChannel', help_text='Where to show the ad'),
        ),
    ]
