# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0013_auto_20141205_2326'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='aside',
            name='created',
        ),
        migrations.RemoveField(
            model_name='aside',
            name='modified',
        ),
        migrations.RemoveField(
            model_name='pullquote',
            name='created',
        ),
        migrations.RemoveField(
            model_name='pullquote',
            name='modified',
        ),
        migrations.AddField(
            model_name='inlinelink',
            name='created',
            field=model_utils.fields.AutoCreatedField(editable=False, verbose_name='created', default=django.utils.timezone.now),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='inlinelink',
            name='modified',
            field=model_utils.fields.AutoLastModifiedField(editable=False, verbose_name='modified', default=django.utils.timezone.now),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='storyelement',
            name='created',
            field=model_utils.fields.AutoCreatedField(editable=False, verbose_name='created', default=django.utils.timezone.now),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='storyelement',
            name='modified',
            field=model_utils.fields.AutoLastModifiedField(editable=False, verbose_name='modified', default=django.utils.timezone.now),
            preserve_default=True,
        ),
    ]
