# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import model_utils.fields
import django.utils.timezone
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0006_auto_20140817_1944'),
        ('stories', '0005_auto_20140822_1552'),
    ]

    operations = [
        migrations.CreateModel(
            name='Aside',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('bodytext_markup', models.TextField(default='Write your content here.', blank=True, help_text='Content with xtags markup.')),
                ('bodytext_html', models.TextField(default='<p>Placeholder</p>', editable=False, blank=True, help_text='HTML tagged content')),
                ('published', models.BooleanField(default=True, help_text='Choose whether this element is published')),
                ('position', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.')),
                ('parent_story', models.ForeignKey(to='stories.Story')),
            ],
            options={
                'verbose_name_plural': 'Asides',
                'verbose_name': 'Aside',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Pullquote',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('bodytext_markup', models.TextField(default='Write your content here.', blank=True, help_text='Content with xtags markup.')),
                ('bodytext_html', models.TextField(default='<p>Placeholder</p>', editable=False, blank=True, help_text='HTML tagged content')),
                ('published', models.BooleanField(default=True, help_text='Choose whether this element is published')),
                ('position', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.')),
                ('parent_story', models.ForeignKey(to='stories.Story')),
            ],
            options={
                'verbose_name_plural': 'Pullquotes',
                'verbose_name': 'Pullquote',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='StoryImage',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('published', models.BooleanField(default=True, help_text='Choose whether this element is published')),
                ('position', models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MaxValueValidator(10000), django.core.validators.MinValueValidator(0)], help_text='Where in the story does this belong? 0 = At the very beginning, 10000 = At the end.')),
                ('caption', models.CharField(blank=True, max_length=1000, help_text='Text explaining the image')),
                ('creditline', models.CharField(blank=True, max_length=100, help_text='Extra information about image copyrights. Not needed if image is created by a regular contributor.')),
                ('imagefile', models.ForeignKey(to='photo.ImageFile')),
                ('parent_story', models.ForeignKey(to='stories.Story')),
            ],
            options={
                'verbose_name_plural': 'Images',
                'verbose_name': 'Image',
            },
            bases=(models.Model,),
        ),
    ]
