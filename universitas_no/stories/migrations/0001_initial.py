# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Byline',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('credit', models.CharField(choices=[('text', 'Text'), ('photo', 'Photo'), ('illustration', 'Illustration'), ('graphics', 'Graphics')], max_length=20, default=('text', 'Text'))),
                ('title', models.CharField(max_length=200, blank=True)),
            ],
            options={
                'verbose_name_plural': 'Bylines',
                'verbose_name': 'Byline',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ContactInfo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=200, null=True, blank=True)),
                ('title', models.CharField(max_length=200, null=True, blank=True)),
                ('phone', models.CharField(max_length=20, null=True, blank=True)),
                ('email', models.EmailField(max_length=75, null=True, blank=True)),
                ('postal_address', models.CharField(max_length=200, null=True, blank=True)),
                ('street_address', models.CharField(max_length=200, null=True, blank=True)),
                ('webpage', models.URLField()),
                ('contact_type', models.CharField(choices=[('Person', 'Person'), ('Institution', 'Institution'), ('Position', 'Position')], max_length=50)),
            ],
            options={
                'verbose_name_plural': 'ContactInfos',
                'verbose_name': 'ContactInfo',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Contributor',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('displayName', models.CharField(max_length=50, blank=True)),
                ('aliases', models.TextField(blank=True)),
                ('initials', models.CharField(max_length=5, null=True, blank=True)),
            ],
            options={
                'verbose_name_plural': 'Contributors',
                'verbose_name': 'Contributor',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='byline',
            name='contributor',
            field=models.ForeignKey(to='stories.Contributor'),
            preserve_default=True,
        ),
        migrations.CreateModel(
            name='Position',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(help_text='Job title at the publication.', max_length=50, unique=True)),
            ],
            options={
                'verbose_name_plural': 'Positions',
                'verbose_name': 'Position',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PrintIssue',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('issue_number', models.CharField(max_length=5)),
                ('publication_date', models.DateField()),
                ('pages', models.IntegerField(help_text='Number of pages')),
                ('pdf', models.FilePathField(help_text='Pdf file for this issue.', null=True, blank=True)),
                ('cover_page', models.FilePathField(help_text='An image file of the front page', null=True, blank=True)),
            ],
            options={
                'verbose_name_plural': 'Issues',
                'verbose_name': 'Issue',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ProdsysTag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('xtag', models.CharField(max_length=50, unique=True, default='@tagname:')),
                ('html_tag', models.CharField(max_length=50, default='p')),
                ('html_class', models.CharField(max_length=50, null=True, blank=True)),
            ],
            options={
                'verbose_name_plural': 'prodsys_tags',
                'verbose_name': 'prodsys_tag',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(help_text='Section title', max_length=50, unique=True)),
            ],
            options={
                'verbose_name_plural': 'Sections',
                'verbose_name': 'Section',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Story',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('prodsys_id', models.PositiveIntegerField(help_text='Id in the prodsys database.')),
                ('title', models.CharField(help_text='The title of the story.', max_length=1000)),
                ('lede', models.TextField(help_text='Summary of the story.', blank=True)),
                ('prodsys_json', models.TextField(help_text='Json imported from prodsys', blank=True)),
                ('bodytext_markup', models.TextField(help_text='The content of the story. Marked up.', blank=True)),
                ('bodytext_html', models.TextField(help_text='The content of the story. Formatted in simple HTML', blank=True, default='<p>Placeholder</p>')),
                ('dateline_place', models.CharField(help_text='Where this story happened.', max_length=50, blank=True)),
                ('dateline_date', models.DateField(help_text='When this story happened.', null=True, blank=True)),
                ('publication_date', models.DateTimeField(help_text='When this story will be published on the web.', null=True, blank=True)),
                ('status', models.IntegerField(choices=[(0, 'Draft'), (5, 'Unpublished'), (10, 'Published')], help_text='Publication status.', default=0)),
                ('theme_word', models.CharField(help_text='Theme', max_length=50)),
                ('slug', models.SlugField(help_text='Human readable url.', editable=False, default='slug-here')),
                ('page', models.IntegerField(help_text='Which page the story was printed on.', null=True, blank=True)),
                ('pdf_url', models.URLField(help_text='URL to the story in pdf.', null=True, blank=True)),
            ],
            options={
                'verbose_name_plural': 'Stories',
                'verbose_name': 'Story',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='byline',
            name='story',
            field=models.ForeignKey(to='stories.Story'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='bylines',
            field=models.ManyToManyField(to='stories.Contributor', through='stories.Byline'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='issue',
            field=models.ForeignKey(to='stories.PrintIssue', help_text='Which issue this story was printed in.', null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='related_stories',
            field=models.ManyToManyField(to='stories.Story'),
            preserve_default=True,
        ),
        migrations.CreateModel(
            name='StoryChild',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('content', models.TextField()),
                ('ordering', models.PositiveSmallIntegerField(default=1)),
                ('position', models.PositiveSmallIntegerField(default=1)),
                ('published', models.NullBooleanField(default=True)),
                ('story', models.ForeignKey(to='stories.Story')),
            ],
            options={
                'verbose_name_plural': 'StoryChildren',
                'verbose_name': 'StoryChild',
            },
            bases=(models.Model,),
        ),
        migrations.AlterUniqueTogether(
            name='storychild',
            unique_together=set([('story', 'ordering', 'position')]),
        ),
        migrations.CreateModel(
            name='StoryType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50, unique=True)),
                ('prodsys_mappe', models.CharField(max_length=100)),
                ('section', models.ForeignKey(to='stories.Section')),
            ],
            options={
                'verbose_name_plural': 'StoryTypes',
                'verbose_name': 'StoryType',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='story',
            name='story_type',
            field=models.ForeignKey(help_text='The type of story.', to='stories.StoryType'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='storytype',
            name='template',
            field=models.ForeignKey(to='stories.Story', blank=True, null=True),
            preserve_default=True,
        ),
    ]
