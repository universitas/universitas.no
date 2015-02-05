# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0003_data_load_sections_and_storytypes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='story',
            name='publication_status',
            field=models.IntegerField(help_text='publication status.', verbose_name='status', default=0, choices=[(0, 'Draft'), (5, 'Ready to edit'), (9, 'Ready to publish on website'), (10, 'Published on website'), (15, 'Will not be published'), (100, 'Used as template for new articles'), (500, 'Technical error')]),
        ),
    ]
