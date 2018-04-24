
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0004_auto_20151014_0004'),
        ('contributors', '0009_auto_20150924_0005'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contributor',
            name='byline_photo',
            field=models.ForeignKey(
                blank=True,
                related_name='person',
                help_text='photo used for byline credit.',
                to='photo.ProfileImage',
                on_delete=django.db.models.deletion.SET_NULL,
                null=True),
        ),
    ]
