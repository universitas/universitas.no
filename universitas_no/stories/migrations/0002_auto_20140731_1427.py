# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='story',
            name='kicker',
            field=models.CharField(default='', help_text='Secondary headline', max_length=1000, blank=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='story',
            name='bodytext_html',
            field=models.TextField(default='<p>Placeholder</p>', editable=False, help_text='The content of the story. Formatted in simple HTML', blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='bodytext_markup',
            field=models.TextField(default='Write your story here.', help_text='The content of the story. Marked up.', blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='lede',
            field=models.TextField(help_text='Introduction or summary of the story', blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='prodsys_json',
            field=models.TextField(editable=False, help_text='Json imported from prodsys', blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='theme_word',
            field=models.CharField(help_text='Theme', max_length=100, blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='title',
            field=models.CharField(help_text='Headline', max_length=1000),
        ),
    ]
