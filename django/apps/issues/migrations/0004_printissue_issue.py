
from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0003_auto_20150309_2314'),
    ]

    operations = [
        migrations.AddField(
            model_name='printissue',
            name='issue',
            field=models.ForeignKey(
                on_delete=models.CASCADE, to='issues.Issue', null=True
            ),
            preserve_default=True,
        ),
    ]
