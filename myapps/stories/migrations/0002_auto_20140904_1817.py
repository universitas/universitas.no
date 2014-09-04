# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0001_squashed_0011_auto_20140903_0253'),
    ]

    operations = [
        migrations.CreateModel(
            name='InlineLink',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('label', models.CharField(verbose_name='link shorthand', default='1', max_length=500, help_text='short label')),
                ('text', models.CharField(verbose_name='link text', max_length=1000, help_text='link text')),
                ('alt_text', models.CharField(blank=True, verbose_name='alt text', editable=False, max_length=500, help_text='alternate link text')),
                ('href', models.CharField(blank=True, verbose_name='link target', max_length=500, help_text='link target')),
                ('status_code', models.CharField(default='', verbose_name='http status code', editable=False, max_length=3, help_text='Status code returned from automatic check.')),
                ('linked_story', models.ForeignKey(to='stories.Story', related_name='incoming_links', verbose_name='linked story', help_text='link to story on this website.', blank=True, null=True)),
                ('parent_story', models.ForeignKey(to='stories.Story', related_name='inline_links')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterField(
            model_name='aside',
            name='position',
            field=models.PositiveSmallIntegerField(verbose_name='position', validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], default=0, help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.'),
        ),
        migrations.AlterField(
            model_name='aside',
            name='published',
            field=models.BooleanField(verbose_name='published', default=True, help_text='Choose whether this element is published'),
        ),
        migrations.AlterField(
            model_name='byline',
            name='credit',
            field=models.CharField(choices=[('text', 'Text'), ('photo', 'Photo'), ('video', 'Video'), ('illus', 'Illustration'), ('graph', 'Graphics'), ('trans', 'Translation'), ('???', 'Unknown')], default='text', max_length=20),
        ),
        migrations.AlterField(
            model_name='pullquote',
            name='position',
            field=models.PositiveSmallIntegerField(verbose_name='position', validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], default=0, help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.'),
        ),
        migrations.AlterField(
            model_name='pullquote',
            name='published',
            field=models.BooleanField(verbose_name='published', default=True, help_text='Choose whether this element is published'),
        ),
        migrations.AlterField(
            model_name='section',
            name='title',
            field=models.CharField(verbose_name='section title', unique=True, max_length=50, help_text='Section title'),
        ),
        migrations.AlterField(
            model_name='story',
            name='images',
            field=models.ManyToManyField(to='photo.ImageFile', verbose_name='images', through='stories.StoryImage', help_text='connected images with captions.'),
        ),
        migrations.AlterField(
            model_name='story',
            name='legacy_html_source',
            field=models.TextField(blank=True, verbose_name='Imported html source.', editable=False, help_text='From old web page. For reference only.', null=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='legacy_prodsys_source',
            field=models.TextField(blank=True, verbose_name='Imported xtagged source.', editable=False, help_text='From prodsys. For reference only.', null=True),
        ),
        migrations.AlterField(
            model_name='storyimage',
            name='caption',
            field=models.CharField(blank=True, verbose_name='caption', max_length=1000, help_text='Text explaining the media.'),
        ),
        migrations.AlterField(
            model_name='storyimage',
            name='creditline',
            field=models.CharField(blank=True, verbose_name='credit line', max_length=100, help_text='Extra information about media attribution and license.'),
        ),
        migrations.AlterField(
            model_name='storyimage',
            name='imagefile',
            field=models.ForeignKey(to='photo.ImageFile', verbose_name='image file', help_text='Choose an image by name or upload a new one.'),
        ),
        migrations.AlterField(
            model_name='storyimage',
            name='position',
            field=models.PositiveSmallIntegerField(verbose_name='position', validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], default=0, help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.'),
        ),
        migrations.AlterField(
            model_name='storyimage',
            name='published',
            field=models.BooleanField(verbose_name='published', default=True, help_text='Choose whether this element is published'),
        ),
        migrations.AlterField(
            model_name='storyimage',
            name='size',
            field=models.PositiveSmallIntegerField(verbose_name='image size', default=1, help_text='Relative image size.'),
        ),
        migrations.AlterField(
            model_name='storyvideo',
            name='caption',
            field=models.CharField(blank=True, verbose_name='caption', max_length=1000, help_text='Text explaining the media.'),
        ),
        migrations.AlterField(
            model_name='storyvideo',
            name='creditline',
            field=models.CharField(blank=True, verbose_name='credit line', max_length=100, help_text='Extra information about media attribution and license.'),
        ),
        migrations.AlterField(
            model_name='storyvideo',
            name='position',
            field=models.PositiveSmallIntegerField(verbose_name='position', validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], default=0, help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.'),
        ),
        migrations.AlterField(
            model_name='storyvideo',
            name='published',
            field=models.BooleanField(verbose_name='published', default=True, help_text='Choose whether this element is published'),
        ),
        migrations.AlterField(
            model_name='storyvideo',
            name='size',
            field=models.PositiveSmallIntegerField(verbose_name='image size', default=1, help_text='Relative image size.'),
        ),
    ]
