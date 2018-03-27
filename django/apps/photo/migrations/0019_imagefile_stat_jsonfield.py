import django.contrib.postgres.fields.jsonb
import django.core.serializers.json
from django.db import migrations


def migrate_stats(apps, schema_editor):
    ImageFile = apps.get_model("photo", "ImageFile")
    for img in ImageFile.objects.all():
        img.stat = {
            'md5': img._md5,
            'size': img._size,
            'mtime': img._mtime,
        }
        img.save(update_fields=['stat'])


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0018_auto_20171207_1517'),
    ]

    operations = [
        migrations.AddField(
            model_name='imagefile',
            name='stat',
            field=django.contrib.postgres.fields.jsonb.JSONField(
                default=dict,
                editable=False,
                encoder=django.core.serializers.json.DjangoJSONEncoder,
                help_text='file stats',
                verbose_name='stat'
            ),
        ),
        migrations.RunPython(code=migrate_stats),
        migrations.RemoveField(
            model_name='imagefile',
            name='_md5',
        ),
        migrations.RemoveField(
            model_name='imagefile',
            name='_mtime',
        ),
        migrations.RemoveField(
            model_name='imagefile',
            name='_size',
        ),
    ]
