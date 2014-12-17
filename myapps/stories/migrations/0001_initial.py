# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import myapps.stories.models
import model_utils.fields
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0001_initial'),
        ('contributors', '0001_initial'),
        ('photo', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Byline',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('credit', models.CharField(choices=[('text', 'Text'), ('photo', 'Photo'), ('video', 'Video'), ('illus', 'Illustration'), ('graph', 'Graphics'), ('trans', 'Translation'), ('???', 'Unknown')], default='text', max_length=20)),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('number', models.PositiveSmallIntegerField(default=1, help_text='link label')),
                ('href', models.CharField(max_length=500, verbose_name='link target', blank=True, help_text='link target')),
                ('alt_text', models.CharField(max_length=500, verbose_name='alt text', blank=True, help_text='alternate link text')),
                ('text', models.TextField(verbose_name='link text', editable=False, blank=True, help_text='link text')),
                ('status_code', models.CharField(default='', help_text='Status code returned from automatic check.', choices=[('', 'Not checked yet'), ('DNS', 'DNS lookup error'), ('URL', 'Malformed http url'), ('INT', 'Internal link'), ('200', '200 OK'), ('403', '403 Forbidden'), ('404', '404 Not Found'), ('408', '408 Request Timeout'), ('410', '410 Gone'), ('418', "418 I'm a teapot (RFC 2324)"), ('500', '500 Internal Server Error')], verbose_name='http status code', editable=False, max_length=3)),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('title', models.CharField(verbose_name='section title', unique=True, max_length=50, help_text='Section title')),
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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('bodytext_markup', myapps.stories.models.MarkupTextField(default='', verbose_name='bodytext tagged text', blank=True, help_text='Content with xtags markup.')),
                ('bodytext_html', models.TextField(default='', verbose_name='bodytext html tagged', editable=False, blank=True, help_text='HTML tagged content')),
                ('prodsak_id', models.PositiveIntegerField(verbose_name='prodsak id', null=True, editable=False, blank=True, help_text='primary id in the legacy prodsys database.')),
                ('title', myapps.stories.models.MarkupCharField(default='', max_length=1000, verbose_name='title', blank=True, help_text='main headline or title')),
                ('kicker', myapps.stories.models.MarkupCharField(default='', max_length=1000, verbose_name='kicker', blank=True, help_text='secondary headline, usually displayed above main headline')),
                ('lede', myapps.stories.models.MarkupTextField(default='', verbose_name='lede', blank=True, help_text='brief introduction or summary of the story')),
                ('comment', models.TextField(default='', verbose_name='comment', blank=True, help_text='for internal use only')),
                ('theme_word', myapps.stories.models.MarkupCharField(default='', max_length=100, verbose_name='theme word', blank=True, help_text='theme, topic, main keyword')),
                ('publication_date', models.DateTimeField(verbose_name='publication date', null=True, blank=True, help_text='when this story will be published on the web.')),
                ('publication_status', models.IntegerField(choices=[(0, 'Draft'), (5, 'Ready to edit'), (9, 'Ready to publish on website'), (10, 'Published on website'), (15, 'Will not be published'), (500, 'Technical error')], default=0, verbose_name='status', help_text='publication status.')),
                ('slug', models.SlugField(default='slug-here', help_text='human readable url.', verbose_name='slug', editable=False)),
                ('page', models.IntegerField(verbose_name='page', null=True, blank=True, help_text='which page the story was printed on.')),
                ('hit_count', models.PositiveIntegerField(default=0, verbose_name='total page views', editable=False, help_text='how many time the article has been viewed.')),
                ('hot_count', models.PositiveIntegerField(default=0, verbose_name='recent page views', editable=False, help_text='calculated value representing recent page views.')),
                ('bylines_html', models.TextField(default='', verbose_name='all bylines as html.', editable=False)),
                ('legacy_html_source', models.TextField(verbose_name='Imported html source.', null=True, editable=False, blank=True, help_text='From old web page. For reference only.')),
                ('legacy_prodsys_source', models.TextField(verbose_name='Imported xtagged source.', null=True, editable=False, blank=True, help_text='From prodsys. For reference only.')),
                ('bylines', models.ManyToManyField(through='stories.Byline', verbose_name='bylines', to='contributors.Contributor', help_text='the people who created this content.')),
                ('issue', models.ForeignKey(to='issues.PrintIssue', blank=True, help_text='which issue this story was printed in.', verbose_name='issue', null=True)),
            ],
            options={
                'verbose_name': 'Story',
                'verbose_name_plural': 'Stories',
            },
            bases=(models.Model, myapps.stories.models.MarkupModelMixin),
        ),
        migrations.CreateModel(
            name='StoryElement',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('_subclass', models.CharField(editable=False, max_length=200)),
                ('index', models.PositiveSmallIntegerField(default=0, verbose_name='index', null=True, blank=True, help_text='Leave blank to unpublish')),
                ('top', models.BooleanField(default=False, help_text='Is this element placed on top?')),
            ],
            options={
                'ordering': ['index'],
                'verbose_name': 'story element',
                'verbose_name_plural': 'story elements',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Pullquote',
            fields=[
                ('storyelement_ptr', models.OneToOneField(primary_key=True, parent_link=True, auto_created=True, to='stories.StoryElement', serialize=False)),
                ('bodytext_markup', myapps.stories.models.MarkupTextField(default='', verbose_name='bodytext tagged text', blank=True, help_text='Content with xtags markup.')),
                ('bodytext_html', models.TextField(default='', verbose_name='bodytext html tagged', editable=False, blank=True, help_text='HTML tagged content')),
            ],
            options={
                'verbose_name': 'Pullquote',
                'verbose_name_plural': 'Pullquotes',
            },
            bases=('stories.storyelement', models.Model, myapps.stories.models.MarkupModelMixin),
        ),
        migrations.CreateModel(
            name='Aside',
            fields=[
                ('storyelement_ptr', models.OneToOneField(primary_key=True, parent_link=True, auto_created=True, to='stories.StoryElement', serialize=False)),
                ('bodytext_markup', myapps.stories.models.MarkupTextField(default='', verbose_name='bodytext tagged text', blank=True, help_text='Content with xtags markup.')),
                ('bodytext_html', models.TextField(default='', verbose_name='bodytext html tagged', editable=False, blank=True, help_text='HTML tagged content')),
            ],
            options={
                'verbose_name': 'Aside',
                'verbose_name_plural': 'Asides',
            },
            bases=('stories.storyelement', models.Model, myapps.stories.models.MarkupModelMixin),
        ),
        migrations.CreateModel(
            name='StoryImage',
            fields=[
                ('storyelement_ptr', models.OneToOneField(primary_key=True, parent_link=True, auto_created=True, to='stories.StoryElement', serialize=False)),
                ('caption', myapps.stories.models.MarkupCharField(default='', max_length=1000, verbose_name='caption', blank=True, help_text='Text explaining the media.')),
                ('creditline', myapps.stories.models.MarkupCharField(default='', max_length=100, verbose_name='credit line', blank=True, help_text='Extra information about media attribution and license.')),
                ('size', models.PositiveSmallIntegerField(default=1, verbose_name='image size', help_text='Relative image size.')),
                ('imagefile', models.ForeignKey(to='photo.ImageFile', help_text='Choose an image by name or upload a new one.', verbose_name='image file')),
            ],
            options={
                'verbose_name': 'Image',
                'verbose_name_plural': 'Images',
            },
            bases=('stories.storyelement', myapps.stories.models.MarkupModelMixin),
        ),
        migrations.CreateModel(
            name='StoryType',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=50)),
                ('prodsys_mappe', models.CharField(null=True, blank=True, max_length=20)),
                ('section', models.ForeignKey(to='stories.Section')),
                ('template', models.ForeignKey(to='stories.Story', blank=True, null=True)),
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
                ('storyelement_ptr', models.OneToOneField(primary_key=True, parent_link=True, auto_created=True, to='stories.StoryElement', serialize=False)),
                ('caption', myapps.stories.models.MarkupCharField(default='', max_length=1000, verbose_name='caption', blank=True, help_text='Text explaining the media.')),
                ('creditline', myapps.stories.models.MarkupCharField(default='', max_length=100, verbose_name='credit line', blank=True, help_text='Extra information about media attribution and license.')),
                ('size', models.PositiveSmallIntegerField(default=1, verbose_name='image size', help_text='Relative image size.')),
                ('video_host', models.CharField(choices=[('vimeo', 'vimeo'), ('youtu', 'youtube')], default='vimeo', max_length=20)),
                ('host_video_id', models.CharField(verbose_name='id for video file.', max_length=100, help_text='the part of the url that identifies this particular video')),
            ],
            options={
                'verbose_name': 'Video',
                'verbose_name_plural': 'Videos',
            },
            bases=('stories.storyelement', myapps.stories.models.MarkupModelMixin),
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
            field=models.ForeignKey(to='stories.StoryType', help_text='the type of story.', verbose_name='article type'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='inlinelink',
            name='linked_story',
            field=models.ForeignKey(to='stories.Story', blank=True, help_text='link to story on this website.', related_name='incoming_links', verbose_name='linked story', null=True),
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
    ]
