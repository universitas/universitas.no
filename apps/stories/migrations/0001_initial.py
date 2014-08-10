# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Byline',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('credit', models.CharField(max_length=20, choices=[('t', 'Text'), ('pf', 'Photo'), ('i', 'Illustration'), ('g', 'Graphics')], default='t')),
                ('title', models.CharField(blank=True, null=True, max_length=200)),
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
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('issue_number', models.CharField(max_length=5)),
                ('publication_date', models.DateField()),
                ('pages', models.IntegerField(help_text='Number of pages')),
                ('pdf', models.FilePathField(help_text='Pdf file for this issue.', blank=True, null=True)),
                ('cover_page', models.FilePathField(help_text='An image file of the front page', blank=True, null=True)),
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
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('xtag', models.CharField(max_length=50, unique=True, default='@tagname:')),
                ('html_tag', models.CharField(max_length=50, default='p')),
                ('html_class', models.CharField(blank=True, null=True, max_length=50)),
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
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('title', models.CharField(help_text='Section title', unique=True, max_length=50)),
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
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', editable=False, default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', editable=False, default=django.utils.timezone.now)),
                ('bodytext_markup', models.TextField(help_text='Content with xtags markup.', blank=True, default='Write your content here.')),
                ('bodytext_html', models.TextField(help_text='HTML tagged content', blank=True, editable=False, default='<p>Placeholder</p>')),
                ('prodsys_id', models.PositiveIntegerField(help_text='Id in the prodsys database.')),
                ('title', models.CharField(help_text='Headline', max_length=1000)),
                ('kicker', models.CharField(help_text='Secondary headline', blank=True, max_length=1000)),
                ('lede', models.TextField(help_text='Introduction or summary of the story', blank=True)),
                ('theme_word', models.CharField(help_text='Theme', blank=True, max_length=100)),
                ('prodsys_json', models.TextField(help_text='Json imported from prodsys', blank=True, editable=False)),
                ('dateline_place', models.CharField(help_text='Where this story happened.', blank=True, max_length=50)),
                ('dateline_date', models.DateField(help_text='When this story happened.', blank=True, null=True)),
                ('publication_date', models.DateTimeField(help_text='When this story will be published on the web.', blank=True, null=True)),
                ('status', models.IntegerField(help_text='Publication status.', choices=[(0, 'Draft'), (5, 'Unpublished'), (10, 'Published')], default=0)),
                ('slug', models.SlugField(help_text='Human readable url.', editable=False, default='slug-here')),
                ('page', models.IntegerField(help_text='Which page the story was printed on.', blank=True, null=True)),
                ('pdf_url', models.URLField(help_text='URL to the story in pdf.', blank=True, null=True)),
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
            field=models.ManyToManyField(help_text='The people who created this content.', to='contributors.Contributor', through='stories.Byline'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='issue',
            field=models.ForeignKey(help_text='Which issue this story was printed in.', to='stories.PrintIssue', blank=True, null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='related_stories',
            field=models.ManyToManyField(help_text='Stories with related content.', to='stories.Story'),
            preserve_default=True,
        ),
        migrations.CreateModel(
            name='StoryElementMixin',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('published', models.BooleanField(help_text='Choose whether this element is published', default=True)),
                ('position', models.PositiveSmallIntegerField(help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.', validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], default=0)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Pullquote',
            fields=[
                ('storyelementmixin_ptr', models.OneToOneField(auto_created=True, to='stories.StoryElementMixin', serialize=False, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', editable=False, default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', editable=False, default=django.utils.timezone.now)),
                ('bodytext_markup', models.TextField(help_text='Content with xtags markup.', blank=True, default='Write your content here.')),
                ('bodytext_html', models.TextField(help_text='HTML tagged content', blank=True, editable=False, default='<p>Placeholder</p>')),
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
                ('storyelementmixin_ptr', models.OneToOneField(auto_created=True, to='stories.StoryElementMixin', serialize=False, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', editable=False, default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', editable=False, default=django.utils.timezone.now)),
                ('bodytext_markup', models.TextField(help_text='Content with xtags markup.', blank=True, default='Write your content here.')),
                ('bodytext_html', models.TextField(help_text='HTML tagged content', blank=True, editable=False, default='<p>Placeholder</p>')),
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
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('name', models.CharField(unique=True, max_length=50)),
                ('prodsys_mappe', models.CharField(blank=True, null=True, max_length=20)),
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
