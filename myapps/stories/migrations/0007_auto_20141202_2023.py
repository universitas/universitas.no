# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0006_auto_20141202_1847'),
    ]

    operations = [
        migrations.CreateModel(
            name='StoryElement',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('published', models.BooleanField(default=True, help_text='Choose whether this element is published', verbose_name='published')),
                ('position_vertical', models.PositiveSmallIntegerField(default=0, help_text='Where in the story does this belong? 0 = At the very beginning, 1000 = At the end.', verbose_name='position', validators=[django.core.validators.MaxValueValidator(1000), django.core.validators.MinValueValidator(0)])),
                ('position_horizontal', models.PositiveSmallIntegerField(default=0, help_text='Secondary ordering.', verbose_name='horizontal position')),
                ('parent_story', models.ForeignKey(to='stories.Story')),
            ],
            options={
                'verbose_name_plural': 'story elements',
                'verbose_name': 'story element',
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='aside',
            name='id',
        ),
        migrations.RemoveField(
            model_name='aside',
            name='parent_story',
        ),
        migrations.RemoveField(
            model_name='aside',
            name='position_horizontal',
        ),
        migrations.RemoveField(
            model_name='aside',
            name='position_vertical',
        ),
        migrations.RemoveField(
            model_name='aside',
            name='published',
        ),
        migrations.RemoveField(
            model_name='pullquote',
            name='id',
        ),
        migrations.RemoveField(
            model_name='pullquote',
            name='parent_story',
        ),
        migrations.RemoveField(
            model_name='pullquote',
            name='position_horizontal',
        ),
        migrations.RemoveField(
            model_name='pullquote',
            name='position_vertical',
        ),
        migrations.RemoveField(
            model_name='pullquote',
            name='published',
        ),
        migrations.RemoveField(
            model_name='storyimage',
            name='id',
        ),
        migrations.RemoveField(
            model_name='storyimage',
            name='parent_story',
        ),
        migrations.RemoveField(
            model_name='storyimage',
            name='position_horizontal',
        ),
        migrations.RemoveField(
            model_name='storyimage',
            name='position_vertical',
        ),
        migrations.RemoveField(
            model_name='storyimage',
            name='published',
        ),
        migrations.RemoveField(
            model_name='storyvideo',
            name='id',
        ),
        migrations.RemoveField(
            model_name='storyvideo',
            name='parent_story',
        ),
        migrations.RemoveField(
            model_name='storyvideo',
            name='position_horizontal',
        ),
        migrations.RemoveField(
            model_name='storyvideo',
            name='position_vertical',
        ),
        migrations.RemoveField(
            model_name='storyvideo',
            name='published',
        ),
        migrations.AddField(
            model_name='aside',
            name='storyelement_ptr',
            field=models.OneToOneField(serialize=False, default=1, parent_link=True, to='stories.StoryElement', auto_created=True, primary_key=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pullquote',
            name='storyelement_ptr',
            field=models.OneToOneField(serialize=False, default=1, parent_link=True, to='stories.StoryElement', auto_created=True, primary_key=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='storyimage',
            name='storyelement_ptr',
            field=models.OneToOneField(serialize=False, default=1, parent_link=True, to='stories.StoryElement', auto_created=True, primary_key=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='storyvideo',
            name='storyelement_ptr',
            field=models.OneToOneField(serialize=False, default=1, parent_link=True, to='stories.StoryElement', auto_created=True, primary_key=True),
            preserve_default=False,
        ),
    ]
