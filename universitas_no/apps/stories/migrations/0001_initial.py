# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '__latest__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Byline',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('credit', models.CharField(max_length=20, default=('t', 'Text'), choices=[('t', 'Text'), ('pf', 'Photo'), ('i', 'Illustration'), ('g', 'Graphics')])),
                ('title', models.CharField(null=True, max_length=200, blank=True)),
                ('contributor', models.ForeignKey(to='contributors.Contributor')),
            ],
            options={
                'verbose_name_plural': 'Bylines',
                'verbose_name': 'Byline',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PrintIssue',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('issue_number', models.CharField(max_length=5)),
                ('publication_date', models.DateField()),
                ('pages', models.IntegerField(help_text='Number of pages')),
                ('pdf', models.FilePathField(null=True, help_text='Pdf file for this issue.', blank=True)),
                ('cover_page', models.FilePathField(null=True, help_text='An image file of the front page', blank=True)),
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
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('xtag', models.CharField(max_length=50, default='@tagname:', unique=True)),
                ('html_tag', models.CharField(max_length=50, default='p')),
                ('html_class', models.CharField(null=True, max_length=50, blank=True)),
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
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50, help_text='Section title', unique=True)),
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
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('bodytext_markup', models.TextField(default='Write your content here.', help_text='Content with xtags markup.', blank=True)),
                ('bodytext_html', models.TextField(default='<p>Placeholder</p>', help_text='HTML tagged content', blank=True, editable=False)),
                ('prodsys_id', models.PositiveIntegerField(help_text='Id in the prodsys database.')),
                ('title', models.CharField(max_length=1000, help_text='Headline')),
                ('kicker', models.CharField(max_length=1000, help_text='Secondary headline', blank=True)),
                ('lede', models.TextField(help_text='Introduction or summary of the story', blank=True)),
                ('theme_word', models.CharField(max_length=100, help_text='Theme', blank=True)),
                ('prodsys_json', models.TextField(help_text='Json imported from prodsys', blank=True, editable=False)),
                ('dateline_place', models.CharField(max_length=50, help_text='Where this story happened.', blank=True)),
                ('dateline_date', models.DateField(null=True, help_text='When this story happened.', blank=True)),
                ('publication_date', models.DateTimeField(null=True, help_text='When this story will be published on the web.', blank=True)),
                ('status', models.IntegerField(default=0, help_text='Publication status.', choices=[(0, 'Draft'), (5, 'Unpublished'), (10, 'Published')])),
                ('slug', models.SlugField(default='slug-here', editable=False, help_text='Human readable url.')),
                ('page', models.IntegerField(null=True, help_text='Which page the story was printed on.', blank=True)),
                ('pdf_url', models.URLField(null=True, help_text='URL to the story in pdf.', blank=True)),
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
            field=models.ManyToManyField(through='stories.Byline', to='contributors.Contributor'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='issue',
            field=models.ForeignKey(to='stories.PrintIssue', null=True, help_text='Which issue this story was printed in.', blank=True),
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
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
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
            name='StoryElementMixin',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('published', models.BooleanField(default=True, help_text='Choose whether this element is published')),
                ('position', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(1000), django.core.validators.MinValueValidator(0)], default=0, help_text='Where in the story does this belong? 0 = At the very beginning, 1000 = At the end.')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Pullquote',
            fields=[
                ('storyelementmixin_ptr', models.OneToOneField(primary_key=True, auto_created=True, to='stories.StoryElementMixin', serialize=False)),
                ('bodytext_markup', models.TextField(default='Write your content here.', help_text='Content with xtags markup.', blank=True)),
                ('bodytext_html', models.TextField(default='<p>Placeholder</p>', help_text='HTML tagged content', blank=True, editable=False)),
            ],
            options={
                'verbose_name_plural': 'Pullquotes',
                'verbose_name': 'Pullquote',
            },
            bases=('stories.storyelementmixin', models.Model),
        ),
        migrations.CreateModel(
            name='Aside',
            fields=[
                ('storyelementmixin_ptr', models.OneToOneField(primary_key=True, auto_created=True, to='stories.StoryElementMixin', serialize=False)),
                ('bodytext_markup', models.TextField(default='Write your content here.', help_text='Content with xtags markup.', blank=True)),
                ('bodytext_html', models.TextField(default='<p>Placeholder</p>', help_text='HTML tagged content', blank=True, editable=False)),
            ],
            options={
                'verbose_name_plural': 'Asides',
                'verbose_name': 'Aside',
            },
            bases=('stories.storyelementmixin', models.Model),
        ),
        migrations.AddField(
            model_name='storyelementmixin',
            name='parent_story',
            field=models.ForeignKey(to='stories.Story'),
            preserve_default=True,
        ),
        migrations.CreateModel(
            name='StoryType',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('prodsys_mappe', models.CharField(null=True, max_length=20, blank=True)),
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
            field=models.ForeignKey(to='stories.Story', null=True, blank=True),
            preserve_default=True,
        ),
    ]
