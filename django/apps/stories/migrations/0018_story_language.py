# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0017_auto_20150929_1753'),
    ]

    operations = [
        migrations.AddField(
            model_name='story',
            name='language',
            field=models.CharField(verbose_name='language', default='nb', choices=[('nb', 'Norwegian Bokmal'), ('nn', 'Norwegian Nynorsk'), ('en', 'English')], help_text='language', max_length=10),
        ),
    ]
