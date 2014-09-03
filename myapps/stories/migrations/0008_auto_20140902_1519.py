# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0007_auto_20140830_0028'),
    ]

    operations = [
        migrations.RenameField(
            model_name='story',
            old_name='views',
            new_name='hit_count',
        ),
        migrations.AlterField(
            model_name='story',
            name='bylines_html',
            field=models.TextField(verbose_name='all bylines as html.', editable=False, default=''),
        ),
        migrations.AlterField(
            model_name='story',
            name='status',
            field=models.IntegerField(verbose_name='status', choices=[(0, 'Draft'), (5, 'Ready to edit'), (9, 'Ready to publish on website'), (10, 'Published on website'), (15, 'Will not be published')], help_text='Publication status.', default=0),
        ),
    ]
