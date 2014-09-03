# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0008_auto_20140902_1519'),
    ]

    operations = [
        migrations.AddField(
            model_name='story',
            name='legacy_html_source',
            field=models.TextField(editable=False, verbose_name='Imported html content from old web page.', null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='legacy_prodsys_source',
            field=models.TextField(editable=False, verbose_name='Imported content from prodsys.', null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='storyimage',
            name='caption',
            field=models.CharField(max_length=1000, help_text='Text explaining the media.', blank=True),
        ),
        migrations.AlterField(
            model_name='storyimage',
            name='creditline',
            field=models.CharField(max_length=100, help_text='Extra information about media attribution and license.', blank=True),
        ),
    ]
