# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='inlinelink',
            options={'verbose_name_plural': 'inline links', 'verbose_name': 'inline link'},
        ),
        migrations.RemoveField(
            model_name='inlinelink',
            name='label',
        ),
        migrations.RemoveField(
            model_name='inlinelink',
            name='text',
        ),
        migrations.AddField(
            model_name='inlinelink',
            name='number',
            field=models.PositiveSmallIntegerField(default=1, help_text='link label'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='inlinelink',
            name='alt_text',
            field=models.CharField(help_text='alternate link text', max_length=500, blank=True, verbose_name='alt text'),
        ),
    ]
