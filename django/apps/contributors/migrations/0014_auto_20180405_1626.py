from django.db import migrations
from django.contrib.postgres.operations import UnaccentExtension


class Migration(migrations.Migration):

    dependencies = [
        ('contributors', '0013_auto_20180327_1557'),
    ]

    operations = [
        UnaccentExtension(),
    ]
