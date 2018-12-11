from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '0004_auto_20150512_2248'),
    ]

    operations = [
        migrations.DeleteModel(name='ContactInfo', ),
        migrations.RenameField(
            model_name='stint',
            old_name='duration',
            new_name='end_date',
        ),
    ]
