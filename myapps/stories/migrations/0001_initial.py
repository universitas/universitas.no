# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import django.core.validators
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '__first__'),
        ('photo', '0001_initial'),
        ('contributors', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Aside',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(editable=False, default=django.utils.timezone.now, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, default=django.utils.timezone.now, verbose_name='modified')),
                ('bodytext_markup', models.TextField(blank=True, help_text='Content with xtags markup.', default='', verbose_name='bodytext tagged text')),
                ('bodytext_html', models.TextField(editable=False, help_text='HTML tagged content', blank=True, default='<p>Placeholder</p>', verbose_name='bodytext html tagged')),
                ('published', models.BooleanField(help_text='Choose whether this element is published', default=True, verbose_name='published')),
                ('position', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.', default=0, verbose_name='position')),
            ],
            options={
                'abstract': False,
                'verbose_name': 'Aside',
                'verbose_name_plural': 'Asides',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Byline',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('credit', models.CharField(choices=[('text', 'Text'), ('photo', 'Photo'), ('video', 'Video'), ('illus', 'Illustration'), ('graph', 'Graphics'), ('trans', 'Translation'), ('???', 'Unknown')], max_length=20, default='text')),
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
            name='InlineLink',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('label', models.CharField(max_length=500, help_text='short label', default='1', verbose_name='link shorthand')),
                ('text', models.CharField(help_text='link text', max_length=1000, verbose_name='link text')),
                ('alt_text', models.CharField(editable=False, help_text='alternate link text', blank=True, max_length=500, verbose_name='alt text')),
                ('href', models.CharField(blank=True, help_text='link target', max_length=500, verbose_name='link target')),
                ('status_code', models.CharField(editable=False, max_length=3, help_text='Status code returned from automatic check.', default='', verbose_name='http status code')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Pullquote',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(editable=False, default=django.utils.timezone.now, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, default=django.utils.timezone.now, verbose_name='modified')),
                ('bodytext_markup', models.TextField(blank=True, help_text='Content with xtags markup.', default='', verbose_name='bodytext tagged text')),
                ('bodytext_html', models.TextField(editable=False, help_text='HTML tagged content', blank=True, default='<p>Placeholder</p>', verbose_name='bodytext html tagged')),
                ('published', models.BooleanField(help_text='Choose whether this element is published', default=True, verbose_name='published')),
                ('position', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.', default=0, verbose_name='position')),
            ],
            options={
                'abstract': False,
                'verbose_name': 'Pullquote',
                'verbose_name_plural': 'Pullquotes',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('title', models.CharField(help_text='Section title', max_length=50, verbose_name='section title', unique=True)),
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
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(editable=False, default=django.utils.timezone.now, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, default=django.utils.timezone.now, verbose_name='modified')),
                ('bodytext_markup', models.TextField(blank=True, help_text='Content with xtags markup.', default='', verbose_name='bodytext tagged text')),
                ('bodytext_html', models.TextField(editable=False, help_text='HTML tagged content', blank=True, default='<p>Placeholder</p>', verbose_name='bodytext html tagged')),
                ('prodsak_id', models.PositiveIntegerField(editable=False, null=True, help_text='primary id in the legacy prodsys database.', blank=True, verbose_name='prodsak id')),
                ('title', models.CharField(help_text='main headline or title', max_length=1000, verbose_name='title')),
                ('kicker', models.CharField(blank=True, help_text='secondary headline, usually displayed above main headline', max_length=1000, verbose_name='kicker')),
                ('lede', models.TextField(blank=True, help_text='brief introduction or summary of the story', verbose_name='lede')),
                ('theme_word', models.CharField(blank=True, help_text='theme, topic, main keyword', max_length=100, verbose_name='theme word')),
                ('publication_date', models.DateTimeField(blank=True, null=True, help_text='when this story will be published on the web.', verbose_name='publication date')),
                ('status', models.IntegerField(choices=[(0, 'Draft'), (5, 'Ready to edit'), (9, 'Ready to publish on website'), (10, 'Published on website'), (15, 'Will not be published')], help_text='publication status.', default=0, verbose_name='status')),
                ('slug', models.SlugField(editable=False, verbose_name='slug', default='slug-here', help_text='human readable url.')),
                ('page', models.IntegerField(blank=True, null=True, help_text='which page the story was printed on.', verbose_name='page')),
                ('hit_count', models.PositiveIntegerField(editable=False, help_text='how many time the article has been viewed.', default=0, verbose_name='total page views')),
                ('hot_count', models.PositiveIntegerField(editable=False, help_text='calculated value representing recent page views.', default=0, verbose_name='recent page views')),
                ('bylines_html', models.TextField(editable=False, default='', verbose_name='all bylines as html.')),
                ('legacy_html_source', models.TextField(editable=False, null=True, help_text='From old web page. For reference only.', blank=True, verbose_name='Imported html source.')),
                ('legacy_prodsys_source', models.TextField(editable=False, null=True, help_text='From prodsys. For reference only.', blank=True, verbose_name='Imported xtagged source.')),
                ('bylines', models.ManyToManyField(help_text='the people who created this content.', to='contributors.Contributor', verbose_name='bylines', through='stories.Byline')),
            ],
            options={
                'verbose_name': 'Story',
                'verbose_name_plural': 'Stories',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='StoryImage',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('published', models.BooleanField(help_text='Choose whether this element is published', default=True, verbose_name='published')),
                ('position', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.', default=0, verbose_name='position')),
                ('caption', models.CharField(blank=True, help_text='Text explaining the media.', max_length=1000, verbose_name='caption')),
                ('creditline', models.CharField(blank=True, help_text='Extra information about media attribution and license.', max_length=100, verbose_name='credit line')),
                ('size', models.PositiveSmallIntegerField(help_text='Relative image size.', default=1, verbose_name='image size')),
                ('imagefile', models.ForeignKey(to='photo.ImageFile', verbose_name='image file', help_text='Choose an image by name or upload a new one.')),
                ('parent_story', models.ForeignKey(to='stories.Story')),
            ],
            options={
                'abstract': False,
                'verbose_name': 'Image',
                'verbose_name_plural': 'Images',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='StoryType',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('prodsys_mappe', models.CharField(null=True, blank=True, max_length=20)),
                ('section', models.ForeignKey(to='stories.Section')),
                ('template', models.ForeignKey(null=True, to='stories.Story', blank=True)),
            ],
            options={
                'verbose_name': 'StoryType',
                'verbose_name_plural': 'StoryTypes',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='StoryVideo',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('published', models.BooleanField(help_text='Choose whether this element is published', default=True, verbose_name='published')),
                ('position', models.PositiveSmallIntegerField(validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.', default=0, verbose_name='position')),
                ('caption', models.CharField(blank=True, help_text='Text explaining the media.', max_length=1000, verbose_name='caption')),
                ('creditline', models.CharField(blank=True, help_text='Extra information about media attribution and license.', max_length=100, verbose_name='credit line')),
                ('size', models.PositiveSmallIntegerField(help_text='Relative image size.', default=1, verbose_name='image size')),
                ('video_host', models.CharField(choices=[('vimeo', 'vimeo'), ('youtu', 'youtube')], max_length=20, default='vimeo')),
                ('host_video_id', models.CharField(help_text='the part of the url that identifies this particular video', max_length=100, verbose_name='id for video file.')),
                ('parent_story', models.ForeignKey(to='stories.Story')),
            ],
            options={
                'abstract': False,
                'verbose_name': 'Video',
                'verbose_name_plural': 'Videos',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='story',
            name='images',
            field=models.ManyToManyField(help_text='connected images with captions.', to='photo.ImageFile', verbose_name='images', through='stories.StoryImage'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='issue',
            field=models.ForeignKey(null=True, help_text='which issue this story was printed in.', to='issues.PrintIssue', verbose_name='issue', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='story_type',
            field=models.ForeignKey(to='stories.StoryType', verbose_name='article type', help_text='the type of story.'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='pullquote',
            name='parent_story',
            field=models.ForeignKey(to='stories.Story'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='inlinelink',
            name='linked_story',
            field=models.ForeignKey(null=True, help_text='link to story on this website.', to='stories.Story', verbose_name='linked story', related_name='incoming_links', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='inlinelink',
            name='parent_story',
            field=models.ForeignKey(related_name='inline_links', to='stories.Story'),
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
    ]
