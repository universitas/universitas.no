
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0007_auto_20150421_1938'),
    ]

    operations = [
        migrations.AddField(
            model_name='issue',
            name='issue_name',
            field=models.CharField(max_length=100, blank=True, editable=False),
        ),
    ]
