# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='imagefile',
            name='crop_diameter',
            field=models.PositiveSmallIntegerField(default=100, validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)], help_text='area containing most relevant content. Area is considered a circle with center x,y and diameter d where x and y are the values "from_left" and "from_right" and d is a percentage of the shortest axis. This is used for close cropping of some images, for instance byline photos.'),
            preserve_default=True,
        ),
    ]
