# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0002_auto_20140801_0253'),
    ]

    operations = [
        migrations.AddField(
            model_name='aside',
            name='created',
            field=model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='aside',
            name='modified',
            field=model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='pullquote',
            name='created',
            field=model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='pullquote',
            name='modified',
            field=model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='created',
            field=model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='modified',
            field=model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified'),
            preserve_default=True,
        ),
    ]
