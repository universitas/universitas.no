# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import model_utils.fields
import django.utils.timezone
import myapps.frontpage.models


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0004_auto_20140824_1347'),
        ('frontpage', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contentblock',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('created', model_utils.fields.AutoCreatedField(editable=False, verbose_name='created', default=django.utils.timezone.now)),
                ('modified', model_utils.fields.AutoLastModifiedField(editable=False, verbose_name='modified', default=django.utils.timezone.now)),
                ('position', models.PositiveIntegerField(help_text='larger numbers come first')),
                ('columns', models.PositiveSmallIntegerField(help_text='width - minimum 1 maximum 12', validators=[myapps.frontpage.models.Contentblock.validate_columns], default=6)),
                ('frontpage', models.ForeignKey(to='frontpage.Frontpage')),
                ('story', models.ForeignKey(to='frontpage.FrontpageStory')),
            ],
            options={
                'verbose_name': 'Content block',
                'ordering': ['position'],
                'verbose_name_plural': 'Content blocks',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='frontpagestory',
            name='image',
            field=models.ForeignKey(to='photo.ImageFile', help_text='image', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='frontpagestory',
            name='placements',
            field=models.ManyToManyField(help_text='position and size of story element.', to='frontpage.Frontpage', through='frontpage.Contentblock'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='frontpage',
            name='label',
            field=models.CharField(unique=True, blank=True, max_length=100, help_text='Unique label used in url'),
        ),
    ]
