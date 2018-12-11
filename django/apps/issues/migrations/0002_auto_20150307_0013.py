from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='printissue',
            name='publication_date',
            field=models.DateField(null=True, blank=True),
        ),
    ]
