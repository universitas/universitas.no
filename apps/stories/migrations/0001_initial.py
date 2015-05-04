# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import model_utils.fields
import apps.stories.models


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0001_initial'),
        ('contributors', '0001_initial'),
        ('issues', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Byline',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('credit', models.CharField(max_length=20, default='text', choices=[('text', 'Text'), ('photo', 'Photo'), ('video', 'Video'), ('illus', 'Illustration'), ('graph', 'Graphics'), ('trans', 'Translation'), ('???', 'Unknown')])),
                ('title', models.CharField(max_length=200, blank=True, null=True)),
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
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', editable=False, default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', editable=False, default=django.utils.timezone.now)),
                ('number', models.PositiveSmallIntegerField(default=1, help_text='link label')),
                ('href', models.CharField(verbose_name='link target', max_length=500, blank=True, help_text='link target')),
                ('alt_text', models.CharField(verbose_name='alt text', max_length=500, blank=True, help_text='alternate link text')),
                ('text', models.TextField(verbose_name='link text', editable=False, blank=True, help_text='link text')),
                ('status_code', models.CharField(editable=False, default='', help_text='Status code returned from automatic check.', verbose_name='http status code', max_length=3, choices=[('', 'Not checked yet'), ('DNS', 'DNS lookup error'), ('URL', 'Malformed http url'), ('INT', 'Internal link'), ('200', '200 OK'), ('403', '403 Forbidden'), ('404', '404 Not Found'), ('408', '408 Request Timeout'), ('410', '410 Gone'), ('418', "418 I'm a teapot (RFC 2324)"), ('500', '500 Internal Server Error')])),
            ],
            options={
                'verbose_name': 'inline link',
                'verbose_name_plural': 'inline links',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('title', models.CharField(verbose_name='section title', max_length=50, unique=True, help_text='Section title')),
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
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', editable=False, default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', editable=False, default=django.utils.timezone.now)),
                ('bodytext_markup', apps.stories.models.MarkupTextField(verbose_name='bodytext tagged text', default='', help_text='Content with xtags markup.', blank=True)),
                ('prodsak_id', models.PositiveIntegerField(verbose_name='prodsak id', editable=False, null=True, help_text='primary id in the legacy prodsys database.', blank=True)),
                ('title', apps.stories.models.MarkupCharField(verbose_name='title', max_length=1000, default='', help_text='main headline or title', blank=True)),
                ('kicker', apps.stories.models.MarkupCharField(verbose_name='kicker', max_length=1000, default='', help_text='secondary headline, usually displayed above main headline', blank=True)),
                ('lede', apps.stories.models.MarkupTextField(verbose_name='lede', default='', help_text='brief introduction or summary of the story', blank=True)),
                ('comment', models.TextField(verbose_name='comment', default='', help_text='for internal use only', blank=True)),
                ('theme_word', apps.stories.models.MarkupCharField(verbose_name='theme word', max_length=100, default='', help_text='theme, topic, main keyword', blank=True)),
                ('publication_date', models.DateTimeField(verbose_name='publication date', null=True, help_text='when this story will be published on the web.', blank=True)),
                ('publication_status', models.IntegerField(verbose_name='status', default=0, help_text='publication status.', choices=[(0, 'Draft'), (5, 'Ready to edit'), (9, 'Ready to publish on website'), (10, 'Published on website'), (15, 'Will not be published'), (500, 'Technical error')])),
                ('slug', models.SlugField(editable=False, default='slug-here', help_text='human readable url.', verbose_name='slug')),
                ('page', models.IntegerField(verbose_name='page', null=True, help_text='which page the story was printed on.', blank=True)),
                ('hit_count', models.PositiveIntegerField(verbose_name='total page views', editable=False, default=0, help_text='how many time the article has been viewed.')),
                ('hot_count', models.PositiveIntegerField(verbose_name='recent page views', editable=False, default=0, help_text='calculated value representing recent page views.')),
                ('bylines_html', models.TextField(verbose_name='all bylines as html.', editable=False, default='')),
                ('legacy_html_source', models.TextField(verbose_name='Imported html source.', editable=False, null=True, help_text='From old web page. For reference only.', blank=True)),
                ('legacy_prodsys_source', models.TextField(verbose_name='Imported xtagged source.', editable=False, null=True, help_text='From prodsys. For reference only.', blank=True)),
                ('bylines', models.ManyToManyField(verbose_name='bylines', through='stories.Byline', help_text='the people who created this content.', to='contributors.Contributor')),
                ('issue', models.ForeignKey(null=True, help_text='which issue this story was printed in.', verbose_name='issue', blank=True, to='issues.PrintIssue')),
            ],
            options={
                'verbose_name': 'Story',
                'verbose_name_plural': 'Stories',
            },
            bases=(models.Model, apps.stories.models.MarkupModelMixin),
        ),
        migrations.CreateModel(
            name='StoryElement',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(verbose_name='created', editable=False, default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(verbose_name='modified', editable=False, default=django.utils.timezone.now)),
                ('_subclass', models.CharField(max_length=200, editable=False)),
                ('index', models.PositiveSmallIntegerField(verbose_name='index', null=True, default=0, help_text='Leave blank to unpublish', blank=True)),
                ('top', models.BooleanField(default=False, help_text='Is this element placed on top?')),
            ],
            options={
                'verbose_name': 'story element',
                'ordering': ['index'],
                'verbose_name_plural': 'story elements',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Pullquote',
            fields=[
                ('storyelement_ptr', models.OneToOneField(serialize=False, parent_link=True, primary_key=True, auto_created=True, to='stories.StoryElement')),
                ('bodytext_markup', apps.stories.models.MarkupTextField(verbose_name='bodytext tagged text', default='', help_text='Content with xtags markup.', blank=True)),
            ],
            options={
                'verbose_name': 'Pullquote',
                'verbose_name_plural': 'Pullquotes',
            },
            bases=('stories.storyelement', models.Model, apps.stories.models.MarkupModelMixin),
        ),
        migrations.CreateModel(
            name='Aside',
            fields=[
                ('storyelement_ptr', models.OneToOneField(serialize=False, parent_link=True, primary_key=True, auto_created=True, to='stories.StoryElement')),
                ('bodytext_markup', apps.stories.models.MarkupTextField(verbose_name='bodytext tagged text', default='', help_text='Content with xtags markup.', blank=True)),
            ],
            options={
                'verbose_name': 'Aside',
                'verbose_name_plural': 'Asides',
            },
            bases=('stories.storyelement', models.Model, apps.stories.models.MarkupModelMixin),
        ),
        migrations.CreateModel(
            name='StoryImage',
            fields=[
                ('storyelement_ptr', models.OneToOneField(serialize=False, parent_link=True, primary_key=True, auto_created=True, to='stories.StoryElement')),
                ('caption', apps.stories.models.MarkupCharField(verbose_name='caption', max_length=1000, default='', help_text='Text explaining the media.', blank=True)),
                ('creditline', apps.stories.models.MarkupCharField(verbose_name='credit line', max_length=100, default='', help_text='Extra information about media attribution and license.', blank=True)),
                ('size', models.PositiveSmallIntegerField(verbose_name='image size', default=1, help_text='Relative image size.')),
                ('imagefile', models.ForeignKey(help_text='Choose an image by name or upload a new one.', verbose_name='image file', to='photo.ImageFile')),
            ],
            options={
                'verbose_name': 'Image',
                'verbose_name_plural': 'Images',
            },
            bases=('stories.storyelement', apps.stories.models.MarkupModelMixin),
        ),
        migrations.CreateModel(
            name='StoryType',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50, unique=True)),
                ('prodsys_mappe', models.CharField(max_length=20, blank=True, null=True)),
                ('section', models.ForeignKey(to='stories.Section')),
                ('template', models.ForeignKey(null=True, blank=True, to='stories.Story')),
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
                ('storyelement_ptr', models.OneToOneField(serialize=False, parent_link=True, primary_key=True, auto_created=True, to='stories.StoryElement')),
                ('caption', apps.stories.models.MarkupCharField(verbose_name='caption', max_length=1000, default='', help_text='Text explaining the media.', blank=True)),
                ('creditline', apps.stories.models.MarkupCharField(verbose_name='credit line', max_length=100, default='', help_text='Extra information about media attribution and license.', blank=True)),
                ('size', models.PositiveSmallIntegerField(verbose_name='image size', default=1, help_text='Relative image size.')),
                ('video_host', models.CharField(max_length=20, default='vimeo', choices=[('vimeo', 'vimeo'), ('youtu', 'youtube')])),
                ('host_video_id', models.CharField(verbose_name='id for video file.', max_length=100, help_text='the part of the url that identifies this particular video')),
            ],
            options={
                'verbose_name': 'Video',
                'verbose_name_plural': 'Videos',
            },
            bases=('stories.storyelement', apps.stories.models.MarkupModelMixin),
        ),
        migrations.AddField(
            model_name='storyelement',
            name='parent_story',
            field=models.ForeignKey(to='stories.Story'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='story',
            name='story_type',
            field=models.ForeignKey(help_text='the type of story.', verbose_name='article type', to='stories.StoryType'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='inlinelink',
            name='linked_story',
            field=models.ForeignKey(null=True, help_text='link to story on this website.', verbose_name='linked story', to='stories.Story', blank=True, related_name='incoming_links'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='inlinelink',
            name='parent_story',
            field=models.ForeignKey(to='stories.Story', related_name='inline_links'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='byline',
            name='story',
            field=models.ForeignKey(to='stories.Story'),
            preserve_default=True,
        ),
    ]
