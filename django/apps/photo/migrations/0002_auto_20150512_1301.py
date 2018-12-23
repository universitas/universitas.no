from django.db import migrations, models
import sorl.thumbnail.fields

import apps.photo.models


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0001_squashed_0003_auto_20150228_2151'),
    ]

    operations = [
        migrations.AlterField(
            model_name='imagefile',
            name='source_file',
            field=sorl.thumbnail.fields.ImageField(
                width_field='full_width',
                upload_to=apps.photo.models.upload_image_to,
                max_length=1024,
                height_field='full_height'
            ),
        ),
    ]
