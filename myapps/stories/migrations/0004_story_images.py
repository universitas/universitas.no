# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0002_auto_20140823_0149'),
        ('stories', '0003_auto_20140823_0256'),
    ]

    operations = [
        migrations.AddField(
            model_name='story',
            name='images',
            field=models.ManyToManyField(through='stories.StoryImage', to='photo.ImageFile'),
            preserve_default=True,
        ),
    ]
