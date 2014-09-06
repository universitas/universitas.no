# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0002_auto_20140906_0716'),
    ]

    operations = [
        migrations.AddField(
            model_name='inlinelink',
            name='text',
            field=models.TextField(default='link text', help_text='link text', verbose_name='link text', editable=False, blank=True),
            preserve_default=False,
        ),
    ]
