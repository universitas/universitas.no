# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0009_auto_20141202_2124'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='storyelement',
            options={'ordering': ['index'], 'verbose_name_plural': 'story elements', 'verbose_name': 'story element'},
        ),
        migrations.RemoveField(
            model_name='storyelement',
            name='position_horizontal',
        ),
        migrations.RemoveField(
            model_name='storyelement',
            name='position_vertical',
        ),
        migrations.RemoveField(
            model_name='storyelement',
            name='published',
        ),
        migrations.AddField(
            model_name='storyelement',
            name='index',
            field=models.PositiveSmallIntegerField(null=True, verbose_name='index', blank=True, help_text='Leave blank to unpublish', default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='storyelement',
            name='inline',
            field=models.BooleanField(help_text='Is this element inline or placed at the top?', editable=False, default=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='storyelement',
            name='_subclass',
            field=models.CharField(max_length=200, editable=False),
        ),
    ]
