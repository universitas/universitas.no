# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adverts', '0006_auto_20150208_2116'),
    ]

    operations = [
        migrations.AddField(
            model_name='adchannel',
            name='max_at_once',
            field=models.PositiveSmallIntegerField(default=1, help_text='Maximum ads to show at once.'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='advert',
            name='status',
            field=models.PositiveIntegerField(choices=[(1, 'Not ready to publish.'), (2, 'Not published.'), (3, 'Served to visiting audience.'), (4, 'Fallback ad served if no published ad exists in this channel.')], help_text='Publication status', default=1),
        ),
    ]
