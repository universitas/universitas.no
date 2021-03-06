# Generated by Django 2.0 on 2018-04-12 21:54

import django.contrib.postgres.indexes
import django.contrib.postgres.search
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import django_extensions.db.fields
import model_utils.fields

import apps.stories.models.mixins
import apps.stories.models.sections
import utils.model_mixins


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contributors', '0001_initial'),
        ('photo', '0001_initial'),
        ('issues', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Aside',
            fields=[
                (
                    'id',
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID'
                    )
                ),
                (
                    'created',
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name='created'
                    )
                ),
                (
                    'modified',
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name='modified'
                    )
                ),
                (
                    'bodytext_markup',
                    apps.stories.models.mixins.MarkupTextField(
                        blank=True,
                        default='',
                        help_text='Content with xtags markup.',
                        verbose_name='bodytext tagged text'
                    )
                ),
                (
                    'bodytext_html',
                    models.TextField(
                        blank=True,
                        default='',
                        editable=False,
                        help_text='HTML tagged content',
                        verbose_name='bodytext html tagged'
                    )
                ),
                (
                    'index',
                    models.PositiveSmallIntegerField(
                        blank=True,
                        default=0,
                        help_text='Leave blank to unpublish',
                        null=True,
                        verbose_name='index'
                    )
                ),
                (
                    'top',
                    models.BooleanField(
                        default=False,
                        help_text='Is this element placed on top?'
                    )
                ),
            ],
            options={
                'verbose_name': 'Aside',
                'verbose_name_plural': 'Asides',
            },
            bases=(models.Model, apps.stories.models.mixins.MarkupModelMixin),
        ),
        migrations.CreateModel(
            name='Byline',
            fields=[
                (
                    'id',
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID'
                    )
                ),
                ('ordering', models.IntegerField(default=1)),
                (
                    'credit',
                    models.CharField(
                        choices=[('by', 'By'), ('text', 'Text'),
                                 ('video', 'Video'), ('photo', 'Photo'),
                                 ('video', 'Video'),
                                 ('illustration', 'Illustration'),
                                 ('graphics', 'Graphics'),
                                 ('translation', 'Translation'),
                                 ('text and photo', 'TextPhoto'),
                                 ('text and video', 'TextVideo'),
                                 ('photo and video', 'PhotoVideo')],
                        default='by',
                        max_length=20
                    )
                ),
                (
                    'title',
                    models.CharField(blank=True, max_length=200, null=True)
                ),
                (
                    'contributor',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to='contributors.Contributor'
                    )
                ),
            ],
            options={
                'verbose_name': 'Byline',
                'verbose_name_plural': 'Bylines',
            },
        ),
        migrations.CreateModel(
            name='InlineHtml',
            fields=[
                (
                    'id',
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID'
                    )
                ),
                (
                    'created',
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name='created'
                    )
                ),
                (
                    'modified',
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name='modified'
                    )
                ),
                (
                    'index',
                    models.PositiveSmallIntegerField(
                        blank=True,
                        default=0,
                        help_text='Leave blank to unpublish',
                        null=True,
                        verbose_name='index'
                    )
                ),
                (
                    'top',
                    models.BooleanField(
                        default=False,
                        help_text='Is this element placed on top?'
                    )
                ),
                ('bodytext_html', models.TextField()),
            ],
            options={
                'verbose_name': 'Inline HTML block',
                'verbose_name_plural': 'Inline HTML blocks',
            },
        ),
        migrations.CreateModel(
            name='InlineLink',
            fields=[
                (
                    'id',
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID'
                    )
                ),
                (
                    'created',
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name='created'
                    )
                ),
                (
                    'modified',
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name='modified'
                    )
                ),
                (
                    'number',
                    models.PositiveSmallIntegerField(
                        default=1, help_text='link label'
                    )
                ),
                (
                    'href',
                    models.CharField(
                        blank=True,
                        help_text='link target',
                        max_length=500,
                        verbose_name='link target'
                    )
                ),
                (
                    'alt_text',
                    models.CharField(
                        blank=True,
                        help_text='alternate link text',
                        max_length=500,
                        verbose_name='alt text'
                    )
                ),
                (
                    'text',
                    models.TextField(
                        blank=True,
                        editable=False,
                        help_text='link text',
                        verbose_name='link text'
                    )
                ),
                (
                    'status_code',
                    models.CharField(
                        choices=[('', 'Not checked yet'),
                                 ('DNS', 'DNS lookup error'),
                                 ('URL', 'Malformed http url'),
                                 ('INT', 'Internal link'), ('200', '200 OK'),
                                 ('403', '403 Forbidden'),
                                 ('404', '404 Not Found'),
                                 ('408', '408 Request Timeout'),
                                 ('410', '410 Gone'),
                                 ('418', "418 I'm a teapot (RFC 2324)"),
                                 ('500', '500 Internal Server Error')],
                        default='',
                        editable=False,
                        help_text='Status code returned from automatic check.',
                        max_length=3,
                        verbose_name='http status code'
                    )
                ),
            ],
            options={
                'verbose_name': 'inline link',
                'verbose_name_plural': 'inline links',
            },
        ),
        migrations.CreateModel(
            name='Pullquote',
            fields=[
                (
                    'id',
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID'
                    )
                ),
                (
                    'created',
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name='created'
                    )
                ),
                (
                    'modified',
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name='modified'
                    )
                ),
                (
                    'bodytext_markup',
                    apps.stories.models.mixins.MarkupTextField(
                        blank=True,
                        default='',
                        help_text='Content with xtags markup.',
                        verbose_name='bodytext tagged text'
                    )
                ),
                (
                    'bodytext_html',
                    models.TextField(
                        blank=True,
                        default='',
                        editable=False,
                        help_text='HTML tagged content',
                        verbose_name='bodytext html tagged'
                    )
                ),
                (
                    'index',
                    models.PositiveSmallIntegerField(
                        blank=True,
                        default=0,
                        help_text='Leave blank to unpublish',
                        null=True,
                        verbose_name='index'
                    )
                ),
                (
                    'top',
                    models.BooleanField(
                        default=False,
                        help_text='Is this element placed on top?'
                    )
                ),
            ],
            options={
                'verbose_name': 'Pullquote',
                'verbose_name_plural': 'Pullquotes',
            },
            bases=(models.Model, apps.stories.models.mixins.MarkupModelMixin),
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                (
                    'id',
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID'
                    )
                ),
                (
                    'title',
                    models.CharField(
                        help_text='Section title',
                        max_length=50,
                        unique=True,
                        verbose_name='section title'
                    )
                ),
                (
                    'slug',
                    django_extensions.db.fields.AutoSlugField(
                        blank=True,
                        default='section-slug',
                        editable=False,
                        overwrite=True,
                        populate_from=('title', ),
                        verbose_name='slug'
                    )
                ),
            ],
            options={
                'verbose_name': 'Section',
                'verbose_name_plural': 'Sections',
            },
        ),
        migrations.CreateModel(
            name='Story',
            fields=[
                (
                    'id',
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID'
                    )
                ),
                (
                    'created',
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name='created'
                    )
                ),
                (
                    'modified',
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name='modified'
                    )
                ),
                (
                    'bodytext_markup',
                    apps.stories.models.mixins.MarkupTextField(
                        blank=True,
                        default='',
                        help_text='Content with xtags markup.',
                        verbose_name='bodytext tagged text'
                    )
                ),
                (
                    'bodytext_html',
                    models.TextField(
                        blank=True,
                        default='',
                        editable=False,
                        help_text='HTML tagged content',
                        verbose_name='bodytext html tagged'
                    )
                ),
                (
                    'search_vector',
                    django.contrib.postgres.search.SearchVectorField(
                        editable=False, null=True
                    )
                ),
                (
                    'prodsak_id',
                    models.PositiveIntegerField(
                        blank=True,
                        editable=False,
                        help_text='primary id in the legacy prodsys database.',
                        null=True,
                        verbose_name='prodsak id'
                    )
                ),
                (
                    'language',
                    models.CharField(
                        choices=[('nb', 'Norwegian Bokmal'),
                                 ('nn', 'Norwegian Nynorsk'),
                                 ('en', 'English')],
                        default='nb',
                        help_text='language',
                        max_length=10,
                        verbose_name='language'
                    )
                ),
                (
                    'title',
                    apps.stories.models.mixins.MarkupCharField(
                        blank=True,
                        default='',
                        help_text='main headline or title',
                        max_length=1000,
                        verbose_name='title'
                    )
                ),
                (
                    'slug',
                    django_extensions.db.fields.AutoSlugField(
                        allow_duplicates=True,
                        blank=True,
                        default='story-slug',
                        editable=False,
                        overwrite=True,
                        populate_from=('title', ),
                        verbose_name='slug'
                    )
                ),
                (
                    'kicker',
                    apps.stories.models.mixins.MarkupCharField(
                        blank=True,
                        default='',
                        help_text=
                        'secondary headline, usually displayed above main headline',
                        max_length=1000,
                        verbose_name='kicker'
                    )
                ),
                (
                    'lede',
                    apps.stories.models.mixins.MarkupTextField(
                        blank=True,
                        default='',
                        help_text='brief introduction or summary of the story',
                        verbose_name='lede'
                    )
                ),
                (
                    'comment',
                    models.TextField(
                        blank=True,
                        default='',
                        help_text='for internal use only',
                        verbose_name='comment'
                    )
                ),
                (
                    'theme_word',
                    apps.stories.models.mixins.MarkupCharField(
                        blank=True,
                        default='',
                        help_text='theme, topic, main keyword',
                        max_length=100,
                        verbose_name='theme word'
                    )
                ),
                (
                    'publication_date',
                    models.DateTimeField(
                        blank=True,
                        help_text=
                        'when this story will be published on the web.',
                        null=True,
                        verbose_name='publication date'
                    )
                ),
                (
                    'publication_status',
                    models.IntegerField(
                        choices=[
                            (0, 'Draft'), (3, 'To Journalist'),
                            (4, 'To Sub Editor'), (5, 'To Editor'),
                            (6, 'Ready for newsdesk'),
                            (7, 'Imported to newsdesk'),
                            (9, 'Exported from newsdesk'),
                            (10, 'Published on website'),
                            (11, 'Published, but hidden from search engines'),
                            (15, 'Will not be published'),
                            (100, 'Used as template for new articles'),
                            (500, 'Technical error')
                        ],
                        default=0,
                        help_text='publication status.',
                        verbose_name='status'
                    )
                ),
                (
                    'page',
                    models.IntegerField(
                        blank=True,
                        help_text='which page the story was printed on.',
                        null=True,
                        verbose_name='page'
                    )
                ),
                (
                    'hit_count',
                    models.PositiveIntegerField(
                        default=0,
                        editable=False,
                        help_text='how many time the article has been viewed.',
                        verbose_name='total page views'
                    )
                ),
                (
                    'hot_count',
                    models.PositiveIntegerField(
                        default=1000,
                        editable=False,
                        help_text=
                        'calculated value representing recent page views.',
                        verbose_name='recent page views'
                    )
                ),
                (
                    'bylines_html',
                    models.TextField(
                        default='',
                        editable=False,
                        verbose_name='all bylines as html.'
                    )
                ),
                (
                    'legacy_html_source',
                    models.TextField(
                        blank=True,
                        editable=False,
                        help_text='From old web page. For reference only.',
                        null=True,
                        verbose_name='Imported html source.'
                    )
                ),
                (
                    'legacy_prodsys_source',
                    models.TextField(
                        blank=True,
                        editable=False,
                        help_text='From prodsys. For reference only.',
                        null=True,
                        verbose_name='Imported xtagged source.'
                    )
                ),
                (
                    'working_title',
                    models.CharField(
                        blank=True,
                        help_text='Working title',
                        max_length=1000,
                        verbose_name='Working title'
                    )
                ),
                (
                    'comment_field',
                    models.CharField(
                        choices=[('facebook', 'facebook'),
                                 ('disqus', 'disqus'), ('off', 'off')],
                        default='facebook',
                        help_text='Enable comment field',
                        max_length=16,
                        verbose_name='Comment Field'
                    )
                ),
                (
                    'bylines',
                    models.ManyToManyField(
                        help_text='the people who created this content.',
                        through='stories.Byline',
                        to='contributors.Contributor',
                        verbose_name='bylines'
                    )
                ),
                (
                    'issue',
                    models.ForeignKey(
                        blank=True,
                        help_text='which issue this story was printed in.',
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to='issues.PrintIssue',
                        verbose_name='issue'
                    )
                ),
            ],
            options={
                'verbose_name': 'Story',
                'verbose_name_plural': 'Stories',
                'abstract': False,
            },
            bases=(
                utils.model_mixins.EditURLMixin,
                models.Model,
                apps.stories.models.mixins.MarkupModelMixin,
            ),
        ),
        migrations.CreateModel(
            name='StoryImage',
            fields=[
                (
                    'id',
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID'
                    )
                ),
                (
                    'created',
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name='created'
                    )
                ),
                (
                    'modified',
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name='modified'
                    )
                ),
                (
                    'index',
                    models.PositiveSmallIntegerField(
                        blank=True,
                        default=0,
                        help_text='Leave blank to unpublish',
                        null=True,
                        verbose_name='index'
                    )
                ),
                (
                    'top',
                    models.BooleanField(
                        default=False,
                        help_text='Is this element placed on top?'
                    )
                ),
                (
                    'caption',
                    apps.stories.models.mixins.MarkupCharField(
                        blank=True,
                        default='',
                        help_text='Text explaining the media.',
                        max_length=1000,
                        verbose_name='caption'
                    )
                ),
                (
                    'creditline',
                    apps.stories.models.mixins.MarkupCharField(
                        blank=True,
                        default='',
                        help_text=
                        'Extra information about media attribution and license.',
                        max_length=100,
                        verbose_name='credit line'
                    )
                ),
                (
                    'size',
                    models.PositiveSmallIntegerField(
                        default=1,
                        help_text='Relative image size.',
                        verbose_name='image size'
                    )
                ),
                (
                    'aspect_ratio',
                    models.FloatField(
                        choices=[(0.0, 'auto'), (0.4, '5:2 landscape'),
                                 (0.5, '2:1 landscape'),
                                 (0.667, '3:2 landscape'),
                                 (0.75, '4:3 landscape'), (1.0, 'square'),
                                 (1.333, '3:4 portrait'),
                                 (1.5, '2:3 portrait'), (2.0, '1:2 portrait'),
                                 (100.0, 'graph (force original ratio)')],
                        default=0.0,
                        help_text='height / width',
                        verbose_name='aspect ratio'
                    )
                ),
                (
                    'imagefile',
                    models.ForeignKey(
                        help_text='Choose an image by name or upload a new one.',
                        on_delete=django.db.models.deletion.CASCADE,
                        to='photo.ImageFile',
                        verbose_name='image file'
                    )
                ),
                (
                    'parent_story',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='images',
                        to='stories.Story'
                    )
                ),
            ],
            options={
                'verbose_name': 'Image',
                'verbose_name_plural': 'Images',
            },
            bases=(models.Model, apps.stories.models.mixins.MarkupModelMixin),
        ),
        migrations.CreateModel(
            name='StoryType',
            fields=[
                (
                    'id',
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID'
                    )
                ), ('name', models.CharField(max_length=50, unique=True)),
                (
                    'prodsys_mappe',
                    models.CharField(blank=True, max_length=20, null=True)
                ),
                (
                    'slug',
                    django_extensions.db.fields.AutoSlugField(
                        blank=True,
                        default='storytype-slug',
                        editable=False,
                        overwrite=True,
                        populate_from=['name'],
                        verbose_name='slug'
                    )
                ),
                (
                    'section',
                    models.ForeignKey(
                        default=apps.stories.models.sections.default_section,
                        on_delete=django.db.models.deletion.SET_DEFAULT,
                        to='stories.Section'
                    )
                ),
                (
                    'active',
                    models.BooleanField(
                        default=True,
                        help_text='is this story type active?',
                        verbose_name='active'
                    ),
                )
            ],
            options={
                'verbose_name': 'StoryType',
                'verbose_name_plural': 'StoryTypes',
            },
        ),
        migrations.CreateModel(
            name='StoryVideo',
            fields=[
                (
                    'id',
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID'
                    )
                ),
                (
                    'created',
                    model_utils.fields.AutoCreatedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name='created'
                    )
                ),
                (
                    'modified',
                    model_utils.fields.AutoLastModifiedField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name='modified'
                    )
                ),
                (
                    'index',
                    models.PositiveSmallIntegerField(
                        blank=True,
                        default=0,
                        help_text='Leave blank to unpublish',
                        null=True,
                        verbose_name='index'
                    )
                ),
                (
                    'top',
                    models.BooleanField(
                        default=False,
                        help_text='Is this element placed on top?'
                    )
                ),
                (
                    'caption',
                    apps.stories.models.mixins.MarkupCharField(
                        blank=True,
                        default='',
                        help_text='Text explaining the media.',
                        max_length=1000,
                        verbose_name='caption'
                    )
                ),
                (
                    'creditline',
                    apps.stories.models.mixins.MarkupCharField(
                        blank=True,
                        default='',
                        help_text=
                        'Extra information about media attribution and license.',
                        max_length=100,
                        verbose_name='credit line'
                    )
                ),
                (
                    'size',
                    models.PositiveSmallIntegerField(
                        default=1,
                        help_text='Relative image size.',
                        verbose_name='image size'
                    )
                ),
                (
                    'aspect_ratio',
                    models.FloatField(
                        choices=[(0.0, 'auto'), (0.4, '5:2 landscape'),
                                 (0.5, '2:1 landscape'),
                                 (0.667, '3:2 landscape'),
                                 (0.75, '4:3 landscape'), (1.0, 'square'),
                                 (1.333, '3:4 portrait'),
                                 (1.5, '2:3 portrait'), (2.0, '1:2 portrait'),
                                 (100.0, 'graph (force original ratio)')],
                        default=0.0,
                        help_text='height / width',
                        verbose_name='aspect ratio'
                    )
                ),
                (
                    'video_host',
                    models.CharField(
                        choices=[('vimeo', 'vimeo'), ('youtu', 'youtube')],
                        default='vimeo',
                        max_length=20
                    )
                ),
                (
                    'host_video_id',
                    models.CharField(
                        help_text=
                        'the part of the url that identifies this particular video',
                        max_length=100,
                        verbose_name='id for video file.'
                    )
                ),
                (
                    'parent_story',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='videos',
                        to='stories.Story'
                    )
                ),
            ],
            options={
                'verbose_name': 'Video',
                'verbose_name_plural': 'Videos',
            },
            bases=(models.Model, apps.stories.models.mixins.MarkupModelMixin),
        ),
        migrations.AddField(
            model_name='story',
            name='story_type',
            field=models.ForeignKey(
                default=apps.stories.models.sections.default_story_type,
                help_text='the type of story.',
                on_delete=django.db.models.deletion.SET_DEFAULT,
                to='stories.StoryType',
                verbose_name='article type'
            ),
        ),
        migrations.AddField(
            model_name='pullquote',
            name='parent_story',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='pullquotes',
                to='stories.Story'
            ),
        ),
        migrations.AddField(
            model_name='inlinelink',
            name='linked_story',
            field=models.ForeignKey(
                blank=True,
                help_text='link to story on this website.',
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='incoming_links',
                to='stories.Story',
                verbose_name='linked story'
            ),
        ),
        migrations.AddField(
            model_name='inlinelink',
            name='parent_story',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='inline_links',
                to='stories.Story'
            ),
        ),
        migrations.AddField(
            model_name='inlinehtml',
            name='parent_story',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='inline_html_blocks',
                to='stories.Story'
            ),
        ),
        migrations.AddField(
            model_name='byline',
            name='story',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to='stories.Story'
            ),
        ),
        migrations.AddField(
            model_name='aside',
            name='parent_story',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='asides',
                to='stories.Story'
            ),
        ),
        migrations.AddIndex(
            model_name='story',
            index=django.contrib.postgres.indexes.GinIndex(
                fields=['search_vector'],
                name='stories_sto_search__18a3ad_gin'
            ),
        ),
    ]
