# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import myapps.stories.models


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0015_auto_20141207_1830'),
    ]

    operations = [
        migrations.AlterField(
            model_name='aside',
            name='bodytext_html',
            field=models.TextField(blank=True, verbose_name='bodytext html tagged', default='', editable=False, help_text='HTML tagged content'),
        ),
        migrations.AlterField(
            model_name='aside',
            name='bodytext_markup',
            field=myapps.stories.models.MarkupTextField(blank=True, verbose_name='bodytext tagged text', default='', help_text='Content with xtags markup.'),
        ),
        migrations.AlterField(
            model_name='pullquote',
            name='bodytext_html',
            field=models.TextField(blank=True, verbose_name='bodytext html tagged', default='', editable=False, help_text='HTML tagged content'),
        ),
        migrations.AlterField(
            model_name='pullquote',
            name='bodytext_markup',
            field=myapps.stories.models.MarkupTextField(blank=True, verbose_name='bodytext tagged text', default='', help_text='Content with xtags markup.'),
        ),
        migrations.AlterField(
            model_name='story',
            name='bodytext_html',
            field=models.TextField(blank=True, verbose_name='bodytext html tagged', default='', editable=False, help_text='HTML tagged content'),
        ),
        migrations.AlterField(
            model_name='story',
            name='bodytext_markup',
            field=myapps.stories.models.MarkupTextField(blank=True, verbose_name='bodytext tagged text', default='', help_text='Content with xtags markup.'),
        ),
        migrations.AlterField(
            model_name='story',
            name='kicker',
            field=myapps.stories.models.MarkupCharField(blank=True, help_text='secondary headline, usually displayed above main headline', verbose_name='kicker', max_length=1000, default=''),
        ),
        migrations.AlterField(
            model_name='story',
            name='theme_word',
            field=myapps.stories.models.MarkupCharField(blank=True, help_text='theme, topic, main keyword', verbose_name='theme word', max_length=100, default=''),
        ),
        migrations.AlterField(
            model_name='story',
            name='title',
            field=myapps.stories.models.MarkupCharField(blank=True, help_text='main headline or title', verbose_name='title', max_length=1000, default=''),
        ),
        migrations.AlterField(
            model_name='storyimage',
            name='caption',
            field=myapps.stories.models.MarkupCharField(blank=True, help_text='Text explaining the media.', verbose_name='caption', max_length=1000, default=''),
        ),
        migrations.AlterField(
            model_name='storyimage',
            name='creditline',
            field=myapps.stories.models.MarkupCharField(blank=True, help_text='Extra information about media attribution and license.', verbose_name='credit line', max_length=100, default=''),
        ),
        migrations.AlterField(
            model_name='storyvideo',
            name='caption',
            field=myapps.stories.models.MarkupCharField(blank=True, help_text='Text explaining the media.', verbose_name='caption', max_length=1000, default=''),
        ),
        migrations.AlterField(
            model_name='storyvideo',
            name='creditline',
            field=myapps.stories.models.MarkupCharField(blank=True, help_text='Extra information about media attribution and license.', verbose_name='credit line', max_length=100, default=''),
        ),
    ]
