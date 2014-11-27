# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import sorl.thumbnail.fields


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0004_auto_20141120_2354'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='printissue',
            options={'verbose_name_plural': 'Print issues', 'verbose_name': 'Print issue', 'ordering': ['-publication_date']},
        ),
        migrations.AlterField(
            model_name='printissue',
            name='cover_page',
            field=sorl.thumbnail.fields.ImageField(help_text='An image file of the front page', blank=True, upload_to='pdf/covers/', null=True),
        ),
        migrations.AlterField(
            model_name='printissue',
            name='pdf',
            field=models.FileField(help_text='Pdf file for this issue.', blank=True, upload_to='pdf/', null=True),
        ),
    ]
