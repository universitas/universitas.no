# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0002_auto_20140904_1817'),
    ]

    operations = [
        migrations.AddField(
            model_name='story',
            name='hot_count',
            field=models.PositiveIntegerField(editable=False, default=0, verbose_name='recent page views', help_text='calculated value representing recent page views.'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='story',
            name='bylines',
            field=models.ManyToManyField(verbose_name='bylines', through='stories.Byline', to='contributors.Contributor', help_text='the people who created this content.'),
        ),
        migrations.AlterField(
            model_name='story',
            name='hit_count',
            field=models.PositiveIntegerField(editable=False, default=0, verbose_name='total page views', help_text='how many time the article has been viewed.'),
        ),
        migrations.AlterField(
            model_name='story',
            name='issue',
            field=models.ForeignKey(verbose_name='issue', to='issues.PrintIssue', help_text='which issue this story was printed in.', blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='kicker',
            field=models.CharField(max_length=1000, verbose_name='kicker', help_text='secondary headline, usually displayed above main headline', blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='lede',
            field=models.TextField(verbose_name='lede', help_text='brief introduction or summary of the story', blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='page',
            field=models.IntegerField(verbose_name='page', null=True, help_text='which page the story was printed on.', blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='prodsak_id',
            field=models.PositiveIntegerField(editable=False, verbose_name='prodsak id', null=True, help_text='primary id in the legacy prodsys database.', blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='publication_date',
            field=models.DateTimeField(verbose_name='publication date', null=True, help_text='when this story will be published on the web.', blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='slug',
            field=models.SlugField(editable=False, verbose_name='slug', help_text='human readable url.', default='slug-here'),
        ),
        migrations.AlterField(
            model_name='story',
            name='status',
            field=models.IntegerField(default=0, verbose_name='status', help_text='publication status.', choices=[(0, 'Draft'), (5, 'Ready to edit'), (9, 'Ready to publish on website'), (10, 'Published on website'), (15, 'Will not be published')]),
        ),
        migrations.AlterField(
            model_name='story',
            name='story_type',
            field=models.ForeignKey(verbose_name='article type', help_text='the type of story.', to='stories.StoryType'),
        ),
        migrations.AlterField(
            model_name='story',
            name='theme_word',
            field=models.CharField(max_length=100, verbose_name='theme word', help_text='theme, topic, main keyword', blank=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='title',
            field=models.CharField(max_length=1000, verbose_name='title', help_text='main headline or title'),
        ),
    ]
