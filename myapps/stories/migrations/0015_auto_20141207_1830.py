# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import myapps.stories.models


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0014_auto_20141206_1353'),
    ]

    operations = [
        migrations.AlterField(
            model_name='story',
            name='lede',
            field=myapps.stories.models.MarkupTextField(verbose_name='lede', help_text='brief introduction or summary of the story', blank=True),
        ),
    ]
