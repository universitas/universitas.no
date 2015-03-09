# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0005_auto_20150308_0249'),
    ]

    operations = [
        migrations.AlterField(
            model_name='byline',
            name='credit',
            field=models.CharField(choices=[('by', 'By'), ('text', 'Text'), ('video', 'Video'), ('photo', 'Photo'), ('video', 'Video'), ('illustration', 'Illustration'), ('graphics', 'Graphics'), ('translation', 'Translation'), ('text and photo', 'TextPhoto'), ('text and video', 'TextVideo'), ('photo and video', 'PhotoVideo')], max_length=20, default='by'),
        ),
    ]
