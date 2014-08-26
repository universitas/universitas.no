# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '__first__'),
        ('issues', '0001_initial'),
        ('photo', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Aside',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(editable=False, default=django.utils.timezone.now, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, default=django.utils.timezone.now, verbose_name='modified')),
                ('bodytext_markup', models.TextField(help_text='Content with xtags markup.', blank=True, default='Write your content here.')),
                ('bodytext_html', models.TextField(editable=False, help_text='HTML tagged content', blank=True, default='<p>Placeholder</p>')),
                ('published', models.BooleanField(help_text='Choose whether this element is published', default=True)),
                ('position', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.', default=0)),
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
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('credit', models.CharField(default='t', choices=[('t', 'Text'), ('pf', 'Photo'), ('i', 'Illustration'), ('g', 'Graphics')], max_length=20)),
                ('title', models.CharField(null=True, blank=True, max_length=200)),
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
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(editable=False, default=django.utils.timezone.now, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, default=django.utils.timezone.now, verbose_name='modified')),
                ('bodytext_markup', models.TextField(help_text='Content with xtags markup.', blank=True, default='Write your content here.')),
                ('bodytext_html', models.TextField(editable=False, help_text='HTML tagged content', blank=True, default='<p>Placeholder</p>')),
                ('published', models.BooleanField(help_text='Choose whether this element is published', default=True)),
                ('position', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.', default=0)),
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
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
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
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(editable=False, default=django.utils.timezone.now, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, default=django.utils.timezone.now, verbose_name='modified')),
                ('bodytext_markup', models.TextField(help_text='Content with xtags markup.', blank=True, default='Write your content here.')),
                ('bodytext_html', models.TextField(editable=False, help_text='HTML tagged content', blank=True, default='<p>Placeholder</p>')),
                ('prodsak_id', models.PositiveIntegerField(editable=False, help_text='Id in the prodsys database.', blank=True, null=True)),
                ('title', models.CharField(help_text='Headline', max_length=1000)),
                ('kicker', models.CharField(help_text='Secondary headline', blank=True, max_length=1000)),
                ('lede', models.TextField(help_text='Introduction or summary of the story', blank=True)),
                ('theme_word', models.CharField(help_text='Theme', blank=True, max_length=100)),
                ('publication_date', models.DateTimeField(help_text='When this story will be published on the web.', blank=True, null=True)),
                ('status', models.IntegerField(help_text='Publication status.', choices=[(0, 'Draft'), (5, 'Unpublished'), (10, 'Published')], default=0)),
                ('slug', models.SlugField(editable=False, help_text='Human readable url.', default='slug-here')),
                ('page', models.IntegerField(help_text='Which page the story was printed on.', blank=True, null=True)),
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
            field=models.ForeignKey(blank=True, null=True, to='issues.PrintIssue', help_text='Which issue this story was printed in.'),
            preserve_default=True,
        ),
        migrations.CreateModel(
            name='StoryImage',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('published', models.BooleanField(help_text='Choose whether this element is published', default=True)),
                ('position', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.', default=0)),
                ('caption', models.CharField(help_text='Text explaining the image', blank=True, max_length=1000)),
                ('creditline', models.CharField(help_text='Extra information about image copyrights. Not needed if image is created by a regular contributor.', blank=True, max_length=100)),
                ('imagefile', models.ForeignKey(to='photo.ImageFile')),
                ('parent_story', models.ForeignKey(to='stories.Story')),
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
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(unique=True, max_length=50)),
                ('prodsys_mappe', models.CharField(null=True, blank=True, max_length=20)),
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
            field=models.ForeignKey(to='stories.StoryType', help_text='The type of story.'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='storytype',
            name='template',
            field=models.ForeignKey(null=True, to='stories.Story', blank=True),
            preserve_default=True,
        ),
    ]
