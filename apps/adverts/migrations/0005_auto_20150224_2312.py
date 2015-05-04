# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adverts', '0004_advert_extra_classes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='advert',
            name='status',
            field=models.PositiveIntegerField(default=1, choices=[(1, 'Not ready to publish.'), (2, 'Private.'), (3, 'Served to visiting audience.'), (4, 'Fallback')], help_text='Publication status'),
        ),
    ]
