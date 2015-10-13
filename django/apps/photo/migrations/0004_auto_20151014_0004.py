# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0003_profileimage'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='profileimage',
            options={'verbose_name_plural': 'Profile Images', 'verbose_name': 'Profile Image'},
        ),
        migrations.AlterField(
            model_name='imagefile',
            name='full_height',
            field=models.PositiveIntegerField(editable=False, help_text='full height in pixels', null=True, verbose_name='full height'),
        ),
        migrations.AlterField(
            model_name='imagefile',
            name='full_width',
            field=models.PositiveIntegerField(editable=False, help_text='full height in pixels', null=True, verbose_name='full height'),
        ),
    ]
