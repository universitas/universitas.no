from django.db import migrations


def create_cropbox(image_file):
    radius = image_file.crop_diameter / 2
    data = dict(
        left=(image_file.from_left - radius) / 100,
        right=(image_file.from_left + radius) / 100,
        top=(image_file.from_top - radius) / 100,
        bottom=(image_file.from_top + radius) / 100,
        x=(image_file.from_left) / 100,
        y=(image_file.from_top) / 100,
    )
    CropBox = type(image_file.crop_box)
    return CropBox(**data)


def migrate_cropboxes(apps, schema_editor):
    ImageFile = apps.get_model("photo", "ImageFile")
    for img in ImageFile.objects.all():
        img.crop_box = create_cropbox(img)
        img.save()


class Migration(migrations.Migration):

    dependencies = [('photo', '0009_imagefile_crop_box')]
    operations = [
        migrations.RunPython(
            code=migrate_cropboxes,
            reverse_code=migrations.RunPython.noop,
        )
    ]
