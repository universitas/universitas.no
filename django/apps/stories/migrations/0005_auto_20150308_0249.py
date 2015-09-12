# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0004_auto_20150205_1331'),
    ]

    operations = [
        migrations.AddField(
            model_name='byline',
            name='ordering',
            field=models.IntegerField(default=1),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='byline',
            name='credit',
            field=models.CharField(choices=[('text', 'Text'), ('video', 'Text'), ('text and photo', 'TextPhoto'), ('text and video', 'TextVideo'), ('photo and video', 'PhotoVideo'), ('photo', 'Photo'), ('video', 'Video'), ('illus', 'Illustration'), ('graph', 'Graphics'), ('trans', 'Translation'), ('???', 'Unknown')], max_length=20, default='text'),
        ),
    ]
