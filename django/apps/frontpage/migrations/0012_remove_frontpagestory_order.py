# Generated by Django 2.1 on 2018-09-06 11:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('frontpage', '0011_auto_20180831_2338'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='frontpagestory',
            name='order',
        ),
    ]
