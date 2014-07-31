# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0002_auto_20140731_1427'),
    ]

    operations = [
        migrations.AlterField(
            model_name='byline',
            name='credit',
            field=models.CharField(max_length=20, default=('t', 'Text'), choices=[('t', 'Text'), ('pf', 'Photo'), ('i', 'Illustration'), ('g', 'Graphics')]),
        ),
        migrations.AlterField(
            model_name='byline',
            name='title',
            field=models.CharField(max_length=200, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='bodytext_html',
            field=models.TextField(default='<p>Placeholder</p>', editable=False, help_text='HTML tagged content', blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='bodytext_markup',
            field=models.TextField(default='Write your content here.', help_text='Content with xtags markup.', blank=True),
        ),
        migrations.AlterField(
            model_name='storytype',
            name='prodsys_mappe',
            field=models.CharField(max_length=20, null=True, blank=True),
        ),
    ]
