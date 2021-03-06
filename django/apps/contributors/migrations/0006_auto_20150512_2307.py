from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0001_initial'),
        ('contributors', '0005_auto_20150512_2253'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='position',
            name='group_membership',
        ),
        migrations.AddField(
            model_name='position',
            name='groups',
            field=models.ManyToManyField(
                help_text='Group membership', to='auth.Group'
            ),
            preserve_default=True,
        ),
    ]
