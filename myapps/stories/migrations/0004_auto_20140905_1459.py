# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0003_auto_20140905_1146'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='storyvideo',
            name='vimeo_id',
        ),
        migrations.AddField(
            model_name='storyvideo',
            name='host_video_id',
            field=models.CharField(max_length=100, help_text='the part of the url that identifies this particular video', verbose_name='id for video file.', default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='storyvideo',
            name='video_host',
            field=models.CharField(max_length=20, default='vimeo', choices=[('vimeo', 'vimeo'), ('youtu', 'youtube')]),
            preserve_default=True,
        ),
    ]
