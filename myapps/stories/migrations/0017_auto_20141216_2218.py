# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import myapps.stories.models


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0016_auto_20141211_0505'),
    ]

    operations = [
        migrations.AlterField(
            model_name='story',
            name='kicker',
            field=myapps.stories.models.MarkupCharField(help_text='secondary headline, usually displayed above main headline', verbose_name='kicker', blank=True, max_length=1000),
        ),
        migrations.AlterField(
            model_name='story',
            name='theme_word',
            field=myapps.stories.models.MarkupCharField(help_text='theme, topic, main keyword', verbose_name='theme word', blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='story',
            name='title',
            field=myapps.stories.models.MarkupCharField(help_text='main headline or title', verbose_name='title', max_length=1000),
        ),
        migrations.AlterField(
            model_name='storyimage',
            name='caption',
            field=myapps.stories.models.MarkupCharField(help_text='Text explaining the media.', verbose_name='caption', max_length=1000),
        ),
        migrations.AlterField(
            model_name='storyimage',
            name='creditline',
            field=myapps.stories.models.MarkupCharField(help_text='Extra information about media attribution and license.', verbose_name='credit line', max_length=100),
        ),
        migrations.AlterField(
            model_name='storyvideo',
            name='caption',
            field=myapps.stories.models.MarkupCharField(help_text='Text explaining the media.', verbose_name='caption', max_length=1000),
        ),
        migrations.AlterField(
            model_name='storyvideo',
            name='creditline',
            field=myapps.stories.models.MarkupCharField(help_text='Extra information about media attribution and license.', verbose_name='credit line', max_length=100),
        ),
    ]
