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


def unmigrate_stats(apps, schema_editor):
    ImageFile = apps.get_model("photo", "ImageFile")
    for img in ImageFile.objects.all():
        img._md5 = img.stat.get('md5')
        img._size = img.stat.get('size')
        img._mtime = img.stat.get('mtime')
        img.save(update_fields=['_md5', '_size', '_mtime'])


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
        migrations.RunPython(
            code=migrate_stats,
            reverse_code=unmigrate_stats,
        ),
    ]
