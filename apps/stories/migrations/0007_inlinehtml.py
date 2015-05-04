# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0006_auto_20150309_0131'),
    ]

    operations = [
        migrations.CreateModel(
            name='InlineHtml',
            fields=[
                ('storyelement_ptr', models.OneToOneField(primary_key=True, serialize=False, parent_link=True, auto_created=True, to='stories.StoryElement')),
                ('bodytext_html', models.TextField()),
            ],
            options={
                'verbose_name': 'Inline HTML block',
                'verbose_name_plural': 'Inline HTML blocks',
            },
            bases=('stories.storyelement',),
        ),
    ]
