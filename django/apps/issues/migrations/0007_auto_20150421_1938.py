from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0006_auto_20150310_0117'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='issue',
            options={'ordering': ['-publication_date']},
        ),
    ]
