# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0011_auto_20141205_0227'),
    ]

    operations = [
        migrations.AddField(
            model_name='story',
            name='comment',
            field=models.TextField(blank=True, verbose_name='comment', default='', help_text='for internal use only'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='story',
            name='publication_status',
            field=models.IntegerField(verbose_name='status', choices=[(0, 'Draft'), (5, 'Ready to edit'), (9, 'Ready to publish on website'), (10, 'Published on website'), (15, 'Will not be published'), (500, 'Technical error')], default=0, help_text='publication status.'),
        ),
    ]
