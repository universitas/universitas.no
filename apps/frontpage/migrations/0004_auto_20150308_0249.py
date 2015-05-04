# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import apps.frontpage.models


class Migration(migrations.Migration):

    dependencies = [
        ('frontpage', '0003_frontpagestory_vignette'),
    ]

    operations = [
        migrations.AlterField(
            model_name='staticmodule',
            name='height',
            field=models.PositiveSmallIntegerField(help_text='height - minimum 1 maximum 12', validators=[apps.frontpage.models.FrontPageModule.validate_height], default=2),
        ),
        migrations.AlterField(
            model_name='staticmodule',
            name='render_template',
            field=models.BooleanField(help_text='Use django template rendering', default=False),
        ),
        migrations.AlterField(
            model_name='storymodule',
            name='height',
            field=models.PositiveSmallIntegerField(help_text='height - minimum 1 maximum 12', validators=[apps.frontpage.models.FrontPageModule.validate_height], default=2),
        ),
    ]
