from django.contrib.postgres.operations import TrigramExtension
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0015_imagefile_exif_data'),
    ]

    operations = [
        TrigramExtension(),
    ]
