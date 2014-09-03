# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import model_utils.fields
import django.core.validators
import django.utils.timezone


class Migration(migrations.Migration):

    replaces = [('stories', '0001_initial'), ('stories', '0002_storyimage_size'), ('stories', '0003_auto_20140823_0256'), ('stories', '0004_story_images'), ('stories', '0005_auto_20140828_1605'), ('stories', '0006_story_views'), ('stories', '0007_auto_20140830_0028'), ('stories', '0008_auto_20140902_1519'), ('stories', '0009_auto_20140902_1900'), ('stories', '0010_auto_20140902_1942'), ('stories', '0011_auto_20140903_0253')]

    dependencies = [
        ('photo', '0002_auto_20140823_0149'),
        ('contributors', '__first__'),
        ('issues', '0001_initial'),
        ('photo', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Aside',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('bodytext_markup', models.TextField(default='Write your content here.', blank=True, help_text='Content with xtags markup.')),
                ('bodytext_html', models.TextField(default='<p>Placeholder</p>', blank=True, help_text='HTML tagged content', editable=False)),
                ('published', models.BooleanField(default=True, help_text='Choose whether this element is published')),
                ('position', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.')),
            ],
            options={
                'verbose_name': 'Aside',
                'verbose_name_plural': 'Asides',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Byline',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('credit', models.CharField(default='t', choices=[('t', 'Text'), ('pf', 'Photo'), ('i', 'Illustration'), ('g', 'Graphics')], max_length=20)),
                ('title', models.CharField(blank=True, null=True, max_length=200)),
                ('contributor', models.ForeignKey(to='contributors.Contributor')),
            ],
            options={
                'verbose_name': 'Byline',
                'verbose_name_plural': 'Bylines',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Pullquote',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('bodytext_markup', models.TextField(default='Write your content here.', blank=True, help_text='Content with xtags markup.')),
                ('bodytext_html', models.TextField(default='<p>Placeholder</p>', blank=True, help_text='HTML tagged content', editable=False)),
                ('published', models.BooleanField(default=True, help_text='Choose whether this element is published')),
                ('position', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.')),
            ],
            options={
                'verbose_name': 'Pullquote',
                'verbose_name_plural': 'Pullquotes',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('title', models.CharField(unique=True, help_text='Section title', max_length=50)),
            ],
            options={
                'verbose_name': 'Section',
                'verbose_name_plural': 'Sections',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Story',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('bodytext_markup', models.TextField(default='Write your content here.', blank=True, help_text='Content with xtags markup.')),
                ('bodytext_html', models.TextField(default='<p>Placeholder</p>', blank=True, help_text='HTML tagged content', editable=False)),
                ('prodsak_id', models.PositiveIntegerField(blank=True, null=True, editable=False, help_text='Id in the prodsys database.')),
                ('title', models.CharField(help_text='Headline', max_length=1000)),
                ('kicker', models.CharField(blank=True, help_text='Secondary headline', max_length=1000)),
                ('lede', models.TextField(blank=True, help_text='Introduction or summary of the story')),
                ('theme_word', models.CharField(blank=True, help_text='Theme', max_length=100)),
                ('publication_date', models.DateTimeField(blank=True, null=True, help_text='When this story will be published on the web.')),
                ('status', models.IntegerField(default=0, help_text='Publication status.', choices=[(0, 'Draft'), (5, 'Unpublished'), (10, 'Published')])),
                ('slug', models.SlugField(default='slug-here', help_text='Human readable url.', editable=False)),
                ('page', models.IntegerField(blank=True, null=True, help_text='Which page the story was printed on.')),
            ],
            options={
                'verbose_name': 'Story',
                'verbose_name_plural': 'Stories',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='pullquote',
            name='parent_story',
            field=models.ForeignKey(to='stories.Story'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='byline',
            name='story',
            field=models.ForeignKey(to='stories.Story'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='aside',
            name='parent_story',
            field=models.ForeignKey(to='stories.Story'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='bylines',
            field=models.ManyToManyField(to='contributors.Contributor', through='stories.Byline', help_text='The people who created this content.'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='issue',
            field=models.ForeignKey(to='issues.PrintIssue', null=True, blank=True, help_text='Which issue this story was printed in.'),
            preserve_default=True,
        ),
        migrations.CreateModel(
            name='StoryImage',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('published', models.BooleanField(default=True, help_text='Choose whether this element is published')),
                ('position', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.')),
                ('caption', models.CharField(blank=True, help_text='Text explaining the media.', max_length=1000)),
                ('creditline', models.CharField(blank=True, help_text='Extra information about media attribution and license.', max_length=100)),
                ('imagefile', models.ForeignKey(to='photo.ImageFile')),
                ('parent_story', models.ForeignKey(to='stories.Story')),
                ('size', models.PositiveSmallIntegerField(default=1, help_text='relative image size.')),
            ],
            options={
                'verbose_name': 'Image',
                'verbose_name_plural': 'Images',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='StoryType',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('name', models.CharField(unique=True, max_length=50)),
                ('prodsys_mappe', models.CharField(blank=True, null=True, max_length=20)),
                ('section', models.ForeignKey(to='stories.Section')),
            ],
            options={
                'verbose_name': 'StoryType',
                'verbose_name_plural': 'StoryTypes',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='story',
            name='story_type',
            field=models.ForeignKey(to='stories.StoryType', help_text='The type of story.', verbose_name='article type'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='storytype',
            name='template',
            field=models.ForeignKey(to='stories.Story', null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='images',
            field=models.ManyToManyField(to='photo.ImageFile', through='stories.StoryImage', verbose_name='images'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='aside',
            name='bodytext_html',
            field=models.TextField(default='<p>Placeholder</p>', blank=True, help_text='HTML tagged content', editable=False, verbose_name='bodytext html tagged'),
        ),
        migrations.AlterField(
            model_name='aside',
            name='bodytext_markup',
            field=models.TextField(default='Write your content here.', blank=True, help_text='Content with xtags markup.', verbose_name='bodytext tagged text'),
        ),
        migrations.AlterField(
            model_name='pullquote',
            name='bodytext_html',
            field=models.TextField(default='<p>Placeholder</p>', blank=True, help_text='HTML tagged content', editable=False, verbose_name='bodytext html tagged'),
        ),
        migrations.AlterField(
            model_name='pullquote',
            name='bodytext_markup',
            field=models.TextField(default='Write your content here.', blank=True, help_text='Content with xtags markup.', verbose_name='bodytext tagged text'),
        ),
        migrations.AlterField(
            model_name='story',
            name='bodytext_html',
            field=models.TextField(default='<p>Placeholder</p>', blank=True, help_text='HTML tagged content', editable=False, verbose_name='bodytext html tagged'),
        ),
        migrations.AlterField(
            model_name='story',
            name='bodytext_markup',
            field=models.TextField(default='Write your content here.', blank=True, help_text='Content with xtags markup.', verbose_name='bodytext tagged text'),
        ),
        migrations.AlterField(
            model_name='story',
            name='bylines',
            field=models.ManyToManyField(to='contributors.Contributor', through='stories.Byline', help_text='The people who created this content.', verbose_name='bylines'),
        ),
        migrations.AlterField(
            model_name='story',
            name='issue',
            field=models.ForeignKey(to='issues.PrintIssue', null=True, help_text='Which issue this story was printed in.', blank=True, verbose_name='issue'),
        ),
        migrations.AlterField(
            model_name='story',
            name='kicker',
            field=models.CharField(blank=True, help_text='Secondary headline', verbose_name='kicker', max_length=1000),
        ),
        migrations.AlterField(
            model_name='story',
            name='lede',
            field=models.TextField(blank=True, help_text='Introduction or summary of the story', verbose_name='lede'),
        ),
        migrations.AlterField(
            model_name='story',
            name='page',
            field=models.IntegerField(blank=True, null=True, verbose_name='page', help_text='Which page the story was printed on.'),
        ),
        migrations.AlterField(
            model_name='story',
            name='prodsak_id',
            field=models.PositiveIntegerField(blank=True, null=True, editable=False, verbose_name='prodsak id', help_text='Id in the prodsys database.'),
        ),
        migrations.AlterField(
            model_name='story',
            name='publication_date',
            field=models.DateTimeField(blank=True, null=True, verbose_name='publication date', help_text='When this story will be published on the web.'),
        ),
        migrations.AlterField(
            model_name='story',
            name='slug',
            field=models.SlugField(default='slug-here', editable=False, help_text='Human readable url.', verbose_name='slug'),
        ),
        migrations.AlterField(
            model_name='story',
            name='status',
            field=models.IntegerField(default=0, help_text='Publication status.', verbose_name='status', choices=[(0, 'Draft'), (5, 'Unpublished'), (10, 'Published')]),
        ),
        migrations.AlterField(
            model_name='story',
            name='theme_word',
            field=models.CharField(blank=True, help_text='Theme', verbose_name='theme word', max_length=100),
        ),
        migrations.AlterField(
            model_name='story',
            name='title',
            field=models.CharField(help_text='Headline', verbose_name='title', max_length=1000),
        ),
        migrations.AddField(
            model_name='story',
            name='hit_count',
            field=models.PositiveIntegerField(default=0, help_text='how many time the article has been viewed', editable=False, verbose_name='views'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='bylines_html',
            field=models.TextField(default='', editable=False, verbose_name='all bylines as html.'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='story',
            name='status',
            field=models.IntegerField(default=0, help_text='Publication status.', verbose_name='status', choices=[(0, 'Draft'), (5, 'Ready to edit'), (9, 'Ready to publish on website'), (10, 'Published on website'), (15, 'Will not be published')]),
        ),
        migrations.AddField(
            model_name='story',
            name='legacy_html_source',
            field=models.TextField(blank=True, null=True, editable=False, verbose_name='Imported html content from old web page.'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='legacy_prodsys_source',
            field=models.TextField(blank=True, null=True, editable=False, verbose_name='Imported content from prodsys.'),
            preserve_default=True,
        ),
        migrations.CreateModel(
            name='StoryVideo',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('published', models.BooleanField(default=True, help_text='Choose whether this element is published')),
                ('position', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.')),
                ('caption', models.CharField(blank=True, help_text='Text explaining the media.', max_length=1000)),
                ('creditline', models.CharField(blank=True, help_text='Extra information about media attribution and license.', max_length=100)),
                ('size', models.PositiveSmallIntegerField(default=1, help_text='relative image size.')),
                ('vimeo_id', models.PositiveIntegerField(help_text='The number at the end of the url for this video at vimeo.com', verbose_name='vimeo id number')),
                ('parent_story', models.ForeignKey(to='stories.Story')),
            ],
            options={
                'abstract': False,
                'verbose_name': 'Video',
                'verbose_name_plural': 'Videos',
            },
            bases=(models.Model,),
        ),
        migrations.AlterField(
            model_name='story',
            name='legacy_html_source',
            field=models.TextField(blank=True, null=True, editable=False, verbose_name='Original html from old web page.'),
        ),
        migrations.AlterField(
            model_name='story',
            name='legacy_prodsys_source',
            field=models.TextField(blank=True, null=True, editable=False, verbose_name='Original text in prodsys.'),
        ),
        migrations.AlterField(
            model_name='aside',
            name='bodytext_markup',
            field=models.TextField(default='', blank=True, help_text='Content with xtags markup.', verbose_name='bodytext tagged text'),
        ),
        migrations.AlterField(
            model_name='pullquote',
            name='bodytext_markup',
            field=models.TextField(default='', blank=True, help_text='Content with xtags markup.', verbose_name='bodytext tagged text'),
        ),
        migrations.AlterField(
            model_name='story',
            name='bodytext_markup',
            field=models.TextField(default='', blank=True, help_text='Content with xtags markup.', verbose_name='bodytext tagged text'),
        ),
    ]
