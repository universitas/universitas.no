# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0004_story_images'),
    ]

    operations = [
        migrations.AlterField(
            model_name='aside',
            name='bodytext_html',
            field=models.TextField(editable=False, verbose_name='bodytext html tagged', default='<p>Placeholder</p>', help_text='HTML tagged content', blank=True),
        ),
        migrations.AlterField(
            model_name='aside',
            name='bodytext_markup',
            field=models.TextField(verbose_name='bodytext tagged text', default='Write your content here.', help_text='Content with xtags markup.', blank=True),
        ),
        migrations.AlterField(
            model_name='pullquote',
            name='bodytext_html',
            field=models.TextField(editable=False, verbose_name='bodytext html tagged', default='<p>Placeholder</p>', help_text='HTML tagged content', blank=True),
        ),
        migrations.AlterField(
            model_name='pullquote',
            name='bodytext_markup',
            field=models.TextField(verbose_name='bodytext tagged text', default='Write your content here.', help_text='Content with xtags markup.', blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='bodytext_html',
            field=models.TextField(editable=False, verbose_name='bodytext html tagged', default='<p>Placeholder</p>', help_text='HTML tagged content', blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='bodytext_markup',
            field=models.TextField(verbose_name='bodytext tagged text', default='Write your content here.', help_text='Content with xtags markup.', blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='bylines',
            field=models.ManyToManyField(verbose_name='bylines', through='stories.Byline', help_text='The people who created this content.', to='contributors.Contributor'),
        ),
        migrations.AlterField(
            model_name='story',
            name='images',
            field=models.ManyToManyField(verbose_name='images', through='stories.StoryImage', to='photo.ImageFile'),
        ),
        migrations.AlterField(
            model_name='story',
            name='issue',
            field=models.ForeignKey(null=True, blank=True, verbose_name='issue', to='issues.PrintIssue', help_text='Which issue this story was printed in.'),
        ),
        migrations.AlterField(
            model_name='story',
            name='kicker',
            field=models.CharField(verbose_name='kicker', help_text='Secondary headline', max_length=1000, blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='lede',
            field=models.TextField(verbose_name='lede', help_text='Introduction or summary of the story', blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='page',
            field=models.IntegerField(null=True, blank=True, help_text='Which page the story was printed on.', verbose_name='page'),
        ),
        migrations.AlterField(
            model_name='story',
            name='prodsak_id',
            field=models.PositiveIntegerField(editable=False, null=True, blank=True, help_text='Id in the prodsys database.', verbose_name='prodsak id'),
        ),
        migrations.AlterField(
            model_name='story',
            name='publication_date',
            field=models.DateTimeField(null=True, blank=True, help_text='When this story will be published on the web.', verbose_name='publication date'),
        ),
        migrations.AlterField(
            model_name='story',
            name='slug',
            field=models.SlugField(editable=False, verbose_name='slug', default='slug-here', help_text='Human readable url.'),
        ),
        migrations.AlterField(
            model_name='story',
            name='status',
            field=models.IntegerField(verbose_name='status', choices=[(0, 'Draft'), (5, 'Unpublished'), (10, 'Published')], help_text='Publication status.', default=0),
        ),
        migrations.AlterField(
            model_name='story',
            name='story_type',
            field=models.ForeignKey(verbose_name='article type', to='stories.StoryType', help_text='The type of story.'),
        ),
        migrations.AlterField(
            model_name='story',
            name='theme_word',
            field=models.CharField(verbose_name='theme word', help_text='Theme', max_length=100, blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='title',
            field=models.CharField(verbose_name='title', help_text='Headline', max_length=1000),
        ),
    ]
