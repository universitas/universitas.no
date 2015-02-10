# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adverts', '0004_auto_20150208_2041'),
    ]

    operations = [
        migrations.AddField(
            model_name='advert',
            name='ad_type',
            field=models.PositiveIntegerField(editable=False, default=3, help_text='Advert type.', choices=[(1, 'Image advert'), (2, 'HTML advert'), (3, 'Dummy or unfinished advert')]),
            preserve_default=True,
        ),
    ]
