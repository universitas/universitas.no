# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_extensions.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0008_remove_story_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='section',
            name='slug',
            field=django_extensions.db.fields.AutoSlugField(overwrite=True, populate_from=('title',), null=True, blank=True, verbose_name='slug', editable=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='slug',
            field=django_extensions.db.fields.AutoSlugField(allow_duplicates=True, overwrite=True, populate_from=('title',), default='slug-here', blank=True, verbose_name='slug', editable=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='storytype',
            name='slug',
            field=django_extensions.db.fields.AutoSlugField(overwrite=True, populate_from=('name',), null=True, blank=True, verbose_name='slug', editable=False),
            preserve_default=True,
        ),
    ]
