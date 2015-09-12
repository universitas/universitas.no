# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0002_imagefile_crop_diameter'),
    ]

    operations = [
        migrations.AlterField(
            model_name='imagefile',
            name='cropping_method',
            field=models.PositiveSmallIntegerField(help_text='How this image has been cropped.', choices=[(0, 'center'), (5, 'corner detection'), (10, 'multiple faces'), (15, 'single face'), (100, 'manual crop')], default=0),
        ),
    ]
