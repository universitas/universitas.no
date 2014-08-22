# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0004_auto_20140822_1403'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='aside',
            name='storyelementmixin_ptr',
        ),
        migrations.DeleteModel(
            name='Aside',
        ),
        migrations.RemoveField(
            model_name='pullquote',
            name='storyelementmixin_ptr',
        ),
        migrations.DeleteModel(
            name='Pullquote',
        ),
        migrations.RemoveField(
            model_name='storyelementmixin',
            name='parent_story',
        ),
        migrations.DeleteModel(
            name='StoryElementMixin',
        ),
    ]
