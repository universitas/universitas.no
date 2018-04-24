from django.contrib.postgres.operations import UnaccentExtension
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '0013_auto_20180327_1557'),
    ]

    operations = [
        UnaccentExtension(),
    ]
