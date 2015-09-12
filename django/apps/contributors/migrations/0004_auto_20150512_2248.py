# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0001_initial'),
        ('contributors', '0003_contributor_verified'),
    ]

    operations = [
        migrations.CreateModel(
            name='Stint',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', primary_key=True, auto_created=True)),
                ('start_date', models.DateField(auto_now_add=True)),
                ('duration', models.DateField(blank=True, null=True)),
                ('contributor', models.ForeignKey(to='contributors.Contributor')),
                ('position', models.ForeignKey(to='contributors.Position')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='position',
            name='group_membership',
            field=models.ForeignKey(to='auth.Group', help_text='Group membership', blank=True, null=True),
            preserve_default=True,
        ),
    ]
