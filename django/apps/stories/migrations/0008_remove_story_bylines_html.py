# Generated by Django 2.0 on 2018-06-18 01:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0007_auto_20180617_1828'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='story',
            name='bylines_html',
        ),
    ]
