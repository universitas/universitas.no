# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='aside',
            name='bodytext_html',
            field=models.TextField(verbose_name='bodytext html tagged', blank=True, editable=False, help_text='HTML tagged content', default=''),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='pullquote',
            name='bodytext_html',
            field=models.TextField(verbose_name='bodytext html tagged', blank=True, editable=False, help_text='HTML tagged content', default=''),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='bodytext_html',
            field=models.TextField(verbose_name='bodytext html tagged', blank=True, editable=False, help_text='HTML tagged content', default=''),
            preserve_default=True,
        ),
    ]
