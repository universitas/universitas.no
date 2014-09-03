# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0010_auto_20140902_1942'),
    ]

    operations = [
        migrations.AlterField(
            model_name='aside',
            name='bodytext_markup',
            field=models.TextField(blank=True, help_text='Content with xtags markup.', default='', verbose_name='bodytext tagged text'),
        ),
        migrations.AlterField(
            model_name='pullquote',
            name='bodytext_markup',
            field=models.TextField(blank=True, help_text='Content with xtags markup.', default='', verbose_name='bodytext tagged text'),
        ),
        migrations.AlterField(
            model_name='story',
            name='bodytext_markup',
            field=models.TextField(blank=True, help_text='Content with xtags markup.', default='', verbose_name='bodytext tagged text'),
        ),
    ]
