# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('frontpage', '0003_remove_frontpage_draft_of'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contentblock',
            name='story',
        ),
        migrations.AddField(
            model_name='contentblock',
            name='frontpage_story',
            field=models.ForeignKey(editable=False, default=0, to='frontpage.FrontpageStory'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='contentblock',
            name='frontpage',
            field=models.ForeignKey(editable=False, to='frontpage.Frontpage'),
        ),
        migrations.AlterField(
            model_name='frontpagestory',
            name='image',
            field=models.ForeignKey(blank=True, null=True, help_text='image', to='photo.ImageFile'),
        ),
    ]
