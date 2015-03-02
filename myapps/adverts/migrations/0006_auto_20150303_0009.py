# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adverts', '0005_auto_20150224_2312'),
    ]

    operations = [
        migrations.AlterField(
            model_name='advert',
            name='status',
            field=models.PositiveIntegerField(help_text='Publication status', default=1, choices=[(1, 'Draft'), (2, 'Private'), (3, 'Published'), (4, 'Fallback')]),
        ),
    ]
