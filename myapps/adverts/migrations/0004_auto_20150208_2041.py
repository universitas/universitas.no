# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adverts', '0003_auto_20150208_1920'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='adformat',
            options={'ordering': ('category', '-width', '-price'), 'verbose_name_plural': 'AdFormats', 'verbose_name': 'AdFormat'},
        ),
        migrations.AlterField(
            model_name='advert',
            name='ad_format',
            field=models.ForeignKey(help_text='Size and shape of ad', to='adverts.AdFormat'),
        ),
        migrations.AlterField(
            model_name='advert',
            name='channel',
            field=models.ForeignKey(help_text='Where to show the ad', blank=True, to='adverts.AdChannel', null=True),
        ),
    ]
