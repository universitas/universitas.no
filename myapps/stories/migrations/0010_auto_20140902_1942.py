# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0009_auto_20140902_1900'),
    ]

    operations = [
        migrations.CreateModel(
            name='StoryVideo',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('published', models.BooleanField(default=True, help_text='Choose whether this element is published')),
                ('position', models.PositiveSmallIntegerField(default=0, help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.', validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)])),
                ('caption', models.CharField(max_length=1000, blank=True, help_text='Text explaining the media.')),
                ('creditline', models.CharField(max_length=100, blank=True, help_text='Extra information about media attribution and license.')),
                ('size', models.PositiveSmallIntegerField(default=1, help_text='relative image size.')),
                ('vimeo_id', models.PositiveIntegerField(help_text='The number at the end of the url for this video at vimeo.com', verbose_name='vimeo id number')),
                ('parent_story', models.ForeignKey(to='stories.Story')),
            ],
            options={
                'verbose_name_plural': 'Videos',
                'abstract': False,
                'verbose_name': 'Video',
            },
            bases=(models.Model,),
        ),
        migrations.AlterField(
            model_name='story',
            name='legacy_html_source',
            field=models.TextField(null=True, blank=True, verbose_name='Original html from old web page.', editable=False),
        ),
        migrations.AlterField(
            model_name='story',
            name='legacy_prodsys_source',
            field=models.TextField(null=True, blank=True, verbose_name='Original text in prodsys.', editable=False),
        ),
    ]
