# Generated by Django 2.0 on 2018-05-29 18:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0004_story_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='story',
            name='url',
            field=models.CharField(
                blank=True, default='', editable=False, max_length=256
            ),
        ),
    ]
